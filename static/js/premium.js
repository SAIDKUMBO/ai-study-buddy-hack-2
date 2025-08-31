// Premium page functionality
let currentPlan = 'monthly';
let paymentAmount = 1000;

// Initialize premium page
document.addEventListener('DOMContentLoaded', function() {
    initializePremiumPage();
    setupPaymentListeners();
});

function initializePremiumPage() {
    // Add animation to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-in');
    });

    // Add hover effects to pricing cards
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize tooltips for features
    initializeTooltips();
}

function setupPaymentListeners() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            updatePaymentMethod(this.value);
        });
    });

    // Phone number validation
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhoneNumber(this.value);
        });
    }

    // Pay button
    const payButton = document.getElementById('pay-button');
    if (payButton) {
        payButton.addEventListener('click', processPayment);
    }
}

function initiatePayment() {
    currentPlan = 'monthly';
    paymentAmount = 1000;
    showPaymentModal();
}

function initiateAnnualPayment() {
    currentPlan = 'annual';
    paymentAmount = 10000;
    showPaymentModal();
}

function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Update payment details
        updatePaymentDetails();
        
        // Add animation
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function updatePaymentDetails() {
    const amountElement = document.getElementById('payment-amount');
    const totalElement = document.getElementById('payment-total');
    
    if (amountElement && totalElement) {
        const amount = currentPlan === 'annual' ? 'KES 10,000' : 'KES 1,000';
        amountElement.textContent = amount;
        totalElement.textContent = amount;
    }
}

function updatePaymentMethod(method) {
    const phoneInput = document.getElementById('phone-number');
    const phoneLabel = document.querySelector('label[for="phone-number"]');
    
    if (method === 'mpesa') {
        if (phoneLabel) phoneLabel.textContent = 'Phone Number (for M-PESA)';
        if (phoneInput) {
            phoneInput.placeholder = '254700000000';
            phoneInput.style.display = 'block';
        }
    } else {
        if (phoneLabel) phoneLabel.textContent = 'Phone Number (Optional)';
        if (phoneInput) {
            phoneInput.style.display = 'block';
            phoneInput.placeholder = '254700000000';
        }
    }
}

function validatePhoneNumber(phone) {
    const phoneInput = document.getElementById('phone-number');
    const payButton = document.getElementById('pay-button');
    
    // Basic phone validation for Kenya
    const phoneRegex = /^254[17]\d{8}$/;
    const isValid = phoneRegex.test(phone);
    
    if (phoneInput) {
        if (phone && !isValid) {
            phoneInput.style.borderColor = '#dc3545';
            showFieldError('Please enter a valid Kenyan phone number (e.g., 254700000000)');
        } else {
            phoneInput.style.borderColor = '#28a745';
            hideFieldError();
        }
    }
    
    // Enable/disable pay button based on validation
    if (payButton) {
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (paymentMethod && paymentMethod.value === 'mpesa') {
            payButton.disabled = !isValid || !phone;
        } else {
            payButton.disabled = false;
        }
    }
}

function showFieldError(message) {
    // Remove existing error
    hideFieldError();
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    `;
    
    const phoneInput = document.getElementById('phone-number');
    if (phoneInput && phoneInput.parentNode) {
        phoneInput.parentNode.appendChild(errorDiv);
    }
}

function hideFieldError() {
    const existingError = document.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

async function processPayment() {
    const payButton = document.getElementById('pay-button');
    const phoneNumber = document.getElementById('phone-number').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (!paymentMethod) {
        showNotification('Please select a payment method.', 'error');
        return;
    }
    
    if (paymentMethod.value === 'mpesa' && !phoneNumber) {
        showNotification('Please enter your phone number for M-PESA payment.', 'error');
        return;
    }
    
    // Disable button and show loading
    if (payButton) {
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    try {
        const response = await fetch('/create_payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: paymentAmount,
                plan: currentPlan,
                payment_method: paymentMethod.value,
                phone_number: phoneNumber
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Redirect to Intasend payment page
            if (data.payment_url) {
                showNotification('Redirecting to payment gateway...', 'info');
                setTimeout(() => {
                    window.location.href = data.payment_url;
                }, 1500);
            } else {
                // For demo purposes, simulate successful payment
                simulateSuccessfulPayment();
            }
        } else {
            showNotification(data.error || 'Payment initialization failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Re-enable button
        if (payButton) {
            payButton.disabled = false;
            payButton.innerHTML = '<i class="fas fa-lock"></i> Pay Securely';
        }
    }
}

function simulateSuccessfulPayment() {
    // This is for demo purposes - in production, this would be handled by webhook
    showNotification('Payment successful! Redirecting to success page...', 'success');
    
    setTimeout(() => {
        window.location.href = '/payment_success';
    }, 2000);
}

function initializeTooltips() {
    // Add tooltips to premium features
    const premiumFeatures = document.querySelectorAll('.pricing-features li');
    premiumFeatures.forEach(feature => {
        const text = feature.textContent;
        if (text.includes('Unlimited')) {
            feature.title = 'Generate as many flashcards as you need without restrictions';
        } else if (text.includes('Analytics')) {
            feature.title = 'Track your learning progress with detailed insights and reports';
        } else if (text.includes('Priority')) {
            feature.title = 'Get faster AI processing with priority queue access';
        } else if (text.includes('PDF')) {
            feature.title = 'Export your flashcards to PDF for offline study';
        } else if (text.includes('Schedules')) {
            feature.title = 'Create personalized study schedules and reminders';
        }
    });
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || colors.info;
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('payment-modal');
    if (modal && e.target === modal) {
        closePaymentModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePaymentModal();
    }
});

// Add CSS animations for premium page
const premiumStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .pricing-card.animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    .notification-close:hover {
        opacity: 1;
    }

    .pricing-card {
        transition: all 0.3s ease;
    }

    .pricing-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .pricing-card.featured {
        transform: scale(1.05);
    }

    .pricing-card.featured:hover {
        transform: scale(1.05) translateY(-10px);
    }

    .modal {
        transition: opacity 0.3s ease;
    }

    .payment-option {
        transition: all 0.3s ease;
    }

    .payment-option:hover {
        border-color: #667eea;
        background: rgba(102, 126, 234, 0.05);
    }

    .payment-option input[type="radio"]:checked + .payment-icon + span {
        color: #667eea;
        font-weight: 600;
    }
`;

// Inject premium styles
const styleSheet = document.createElement('style');
styleSheet.textContent = premiumStyles;
document.head.appendChild(styleSheet);

// Add analytics tracking for premium page
function trackPremiumEvent(eventName, properties = {}) {
    // This would integrate with your analytics service
    console.log('Premium event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            ...properties,
            page_location: window.location.pathname
        });
    }
}

// Track premium page interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track page view
    trackPremiumEvent('premium_page_view');
    
    // Track pricing card interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            const planType = this.querySelector('h3').textContent.toLowerCase();
            trackPremiumEvent('pricing_card_clicked', {
                plan_type: planType
            });
        });
    });
    
    // Track payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            trackPremiumEvent('payment_method_selected', {
                method: this.value
            });
        });
    });
    
    // Track payment initiation
    const payButtons = document.querySelectorAll('.btn-premium');
    payButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planType = this.closest('.pricing-card')?.querySelector('h3')?.textContent.toLowerCase() || 'unknown';
            trackPremiumEvent('payment_initiated', {
                plan_type: planType,
                amount: paymentAmount
            });
        });
    });
});

// Add comparison table interactions
document.addEventListener('DOMContentLoaded', function() {
    const comparisonRows = document.querySelectorAll('.comparison-table tbody tr');
    comparisonRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
});

// Add FAQ interactions
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            trackPremiumEvent('faq_item_clicked', {
                question: this.querySelector('h3').textContent
            });
        });
    });
});

// Add scroll animations for premium page
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.pricing-card, .faq-item, .step-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

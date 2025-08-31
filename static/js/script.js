<script>
console.log("Script is loading...");

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function watchDemo() {
    console.log("watchDemo function called!");
    
    // Check if elements exist
    const subjectSelect = document.getElementById('subject-select');
    const notesInput = document.getElementById('notes-input');
    
    console.log("Subject select found:", !!subjectSelect);
    console.log("Notes input found:", !!notesInput);
    
    if (subjectSelect) {
        subjectSelect.value = 'Biology';
        console.log("Subject set to:", subjectSelect.value);
    }
    
    if (notesInput) {
        notesInput.value = `Photosynthesis is the process by which plants convert sunlight into energy.
    
Key components:
- Chloroplasts contain chlorophyll
- Light-dependent reactions occur in thylakoids
- Calvin cycle happens in the stroma
- Produces glucose and oxygen
- Requires carbon dioxide and water`;
        console.log("Notes filled!");
    }
    
    // Scroll to the form
    scrollToSection('subjects');
    
    // Highlight the generate button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.style.animation = 'pulse 2s infinite';
        setTimeout(() => {
            generateBtn.style.animation = '';
        }, 4000);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded!");
    
    // Security modal functionality
    const steps = document.querySelectorAll('.verification-step');
    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
    }

    // Next button functionality
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep === 0) {
                const email = document.getElementById('user-email').value;
                if (!email || !email.includes('@')) {
                    alert('Please enter a valid email address.');
                    return;
                }
            }
            
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Previous button functionality
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Finish button functionality
    document.querySelector('.finish-step').addEventListener('click', function() {
        document.getElementById('security-modal').style.display = 'none';
    });

    // Initialize first step
    showStep(0);

    // Basic app functionality
    const generateBtn = document.getElementById('generate-btn');
    const subjectSelect = document.getElementById('subject-select');
    const notesInput = document.getElementById('notes-input');

    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const subject = subjectSelect?.value;
            const notes = notesInput?.value?.trim();
            
            if (!subject || !notes) {
                alert('Please select a subject and enter your notes.');
                return;
            }
            
            alert('Flashcard generation would happen here!');
        });
    }
});
</script>
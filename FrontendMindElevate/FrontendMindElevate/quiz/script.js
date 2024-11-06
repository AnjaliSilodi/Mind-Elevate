document.addEventListener("DOMContentLoaded", function () {
    const phq9Questions = [
        "Little interest or pleasure in doing things.",
        "Feeling down, depressed, or hopeless.",
        "Trouble falling or staying asleep, sleeping too much.",
        "Feeling tired or having little energy.",
        "Poor appetite or overeating.",
        "Feeling bad about yourself – or that you are a failure or have let yourself or your family down.",
        "Trouble concentrating on things, such as reading the newspaper or watching TV.",
        "Moving or speaking so slowly that other people could have noticed. Or the opposite – being so fidgety or restless that you have been moving around more than usual.",
        "Thoughts that you would be better off dead or of hurting yourself in some way."
    ];

    let phq9Answers = [];
    let currentIndex = 0;

    function showPHQ9Question(index) {
        const phq9Div = document.getElementById('gdsQuestions');
        phq9Div.innerHTML = ''; // Clear previous content

        if (index < phq9Questions.length) {
            currentIndex = index;
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('form-group');

            const label = document.createElement('label');
            label.textContent = `${index + 1}. ${phq9Questions[index]}`;
            questionDiv.appendChild(label);

            // Create options below the question
            const options = [
                "Not at all",
                "Several days",
                "More than half the days",
                "Nearly every day"
            ];

            options.forEach((optionText, i) => {
                const option = createRadioButton(`phq9${index}`, i, optionText);
                questionDiv.appendChild(option);
            });

            phq9Div.appendChild(questionDiv);

            // Show or hide buttons based on question index
            const nextButton = document.getElementById('nextGDS');
            nextButton.style.display = (index === phq9Questions.length - 1) ? 'none' : 'block';
            const submitButton = document.getElementById('submitGDS');
            submitButton.style.display = (index === phq9Questions.length - 1) ? 'block' : 'none';
        }
    }

    function createRadioButton(name, value, text) {
        const label = document.createElement('label');
        label.style.display = 'block'; // Ensure the radio buttons are on a new line

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = value;

        label.appendChild(input);
        label.appendChild(document.createTextNode(text));
        return label;
    }

    document.getElementById('nextGDS').addEventListener('click', function () {
        // Get the selected value for the current question
        const selectedOption = document.querySelector(`input[name="phq9${currentIndex}"]:checked`);
        if (selectedOption) {
            phq9Answers[currentIndex] = parseInt(selectedOption.value); // Store the selected value
            showPHQ9Question(currentIndex + 1);
        } else {
            alert("Please select an option before proceeding.");
        }
    });

    document.getElementById('submitGDS').addEventListener('click', function () {
        // Get the selected value for the final question
        const selectedOption = document.querySelector(`input[name="phq9${currentIndex}"]:checked`);
        if (selectedOption) {
            phq9Answers[currentIndex] = parseInt(selectedOption.value); // Store the selected value
            const totalScore = phq9Answers.reduce((a, b) => a + b, 0); // Calculate total score
            showSuggestionBasedOnScore(totalScore);
        } else {
            alert("Please select an option before submitting.");
        }
    });

    function showSuggestionBasedOnScore(score) {
        let suggestionText = '';
        let redirectUrl = '';

        if (score >= 0 && score <= 4) {
            suggestionText = "Your score suggests minimal or no depression. Keep maintaining healthy habits!";
            redirectUrl = '../features.html';
        } else if (score >= 5 && score <= 9) {
            suggestionText = "Your score indicates mild depression. Consider lifestyle changes and monitoring your symptoms.";
            redirectUrl = '../features.html';
        } else if (score >= 10 && score <= 14) {
            suggestionText = "Your score indicates moderate depression. It is recommended to consult a healthcare provider.";
            redirectUrl = '../features.html';
        } else if (score >= 15 && score <= 19) {
            suggestionText = "Your score indicates moderately severe depression. Please seek professional help.";
            redirectUrl = '../features.html';
        } else if (score >= 20) {
            suggestionText = "Your score suggests severe depression. Immediate help is strongly recommended.";
            redirectUrl = '../features.html';
        }

        document.getElementById('suggestion').textContent = suggestionText;
        const suggestionContainer = document.getElementById('suggestionContainer');
        suggestionContainer.style.display = 'block';

        const redirectButton = document.createElement('a');
        redirectButton.textContent = "Find Resources";
        redirectButton.href = redirectUrl;
        redirectButton.classList.add('custom-redirect-button'); // Use the custom class
        
        // Remove any previous redirect button if it exists
        const existingButton = suggestionContainer.querySelector('a.btn');
        if (existingButton) {
            suggestionContainer.removeChild(existingButton);
        }

        suggestionContainer.appendChild(redirectButton);
    }
    

    showPHQ9Question(0); // Start with the first question
});

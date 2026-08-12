// 1. Sistema de Enrutamiento SPA
const appRouter = (() => {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-section');

    const navigate = (targetId) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.target === targetId);
        });
        pages.forEach(page => {
            if (page.id === targetId) {
                page.classList.add('active');
                window.scrollTo(0, 0);
            } else {
                page.classList.remove('active');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(e.target.dataset.target);
        });
    });

    return { navigate };
})();

// 2. Motor de Evaluación Avanzado
const quizEngine = (() => {
    const questions = [
        {
            question: "Estructura TeKaMoLo: Ordena mentalmente. 'Ich fahre...'",
            options: [
                "heute wegen meiner Arbeit mit dem Zug nach Berlin.",
                "nach Berlin heute mit dem Zug wegen meiner Arbeit.",
                "mit dem Zug heute nach Berlin wegen meiner Arbeit.",
                "wegen meiner Arbeit heute nach Berlin mit dem Zug."
            ],
            correct: 0,
            explanation: "TeKaMoLo exige orden: Temporal (heute), Kausal (wegen meiner Arbeit), Modal (mit dem Zug), Lokal (nach Berlin)."
        },
        {
            question: "Start Deutsch 1: ¿Cuál es el saludo adecuado para una carta formal si desconoces el nombre del destinatario?",
            options: [
                "Hallo zusammen,",
                "Sehr geehrte Damen und Herren,",
                "Liebe Kolleginnen und Kollegen,",
                "Guten Tag Chef,"
            ],
            correct: 1,
            explanation: "'Sehr geehrte Damen und Herren' es la fórmula obligatoria para correspondencia oficial impersonal."
        },
        {
            question: "Interkulturelle Kommunikation: Debes enviar informes administrativos semanales a la gerencia. ¿Qué frase es asertiva y correcta?",
            options: [
                "Hier sind meine Papiere für diese Woche.",
                "Anbei erhalten Sie die wöchentlichen Verwaltungsberichte.",
                "Schau dir meine Berichte an.",
                "Ich schicke dir die Dokumente."
            ],
            correct: 1,
            explanation: "'Anbei erhalten Sie...' demuestra respeto por el protocolo y vocabulario administrativo preciso."
        },
        {
            question: "Declinación: 'Wir helfen ___ (der Student) bei der Prüfung.'",
            options: [
                "den Studenten",
                "dem Student",
                "dem Studenten",
                "der Student"
            ],
            correct: 2,
            explanation: "El verbo 'helfen' rige Dativo. 'Student' pertenece a la N-Deklination, por lo que suma una 'n' obligatoria al final."
        }
    ];

    let currentQuestion = 0;
    let score = 0;
    let answered = false;
    let timerInterval;
    let timeLeft = 90;

    const stage = document.getElementById('question-stage');
    const questionText = document.getElementById('question-text');
    const optionsGrid = document.getElementById('options-grid');
    const nextBtn = document.getElementById('next-btn');
    const scoreDisplay = document.getElementById('score-display');
    const counterDisplay = document.getElementById('question-counter');
    const progressBar = document.getElementById('quiz-progress');
    const timerDisplay = document.getElementById('timer-display');
    const feedbackPanel = document.getElementById('feedback-panel');
    const feedbackText = document.getElementById('feedback-text');
    const tutoringAlert = document.getElementById('tutoring-alert');

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `⏳ ${m}:${s}`;
    };

    const startTimer = () => {
        clearInterval(timerInterval);
        timerDisplay.textContent = formatTime(timeLeft);
        timerDisplay.classList.remove('timer-warning');

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
            
            if (timeLeft <= 15) timerDisplay.classList.add('timer-warning');
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                forceEndGame();
            }
        }, 1000);
    };

    const loadQuestion = () => {
        if (!stage) return;
        answered = false;
        stage.classList.remove('slide-out');
        const q = questions[currentQuestion];
        
        questionText.textContent = q.question;
        counterDisplay.textContent = `Pregunta ${currentQuestion + 1}/${questions.length}`;
        const progressPercentage = ((currentQuestion) / questions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        feedbackPanel.className = 'feedback-panel hidden';
        tutoringAlert.classList.add('hidden');
        nextBtn.classList.add('hidden');
        optionsGrid.innerHTML = '';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleAnswer(index, btn));
            optionsGrid.appendChild(btn);
        });
    };

    const handleAnswer = (selectedIndex, button) => {
        if (answered) return;
        answered = true;

        const correctIndex = questions[currentQuestion].correct;
        const allButtons = document.querySelectorAll('.option-btn');
        feedbackPanel.classList.remove('hidden');
        
        feedbackPanel.classList.remove('success', 'error');

        if (selectedIndex === correctIndex) {
            button.classList.add('correct', 'pop-anim');
            score += 25;
            scoreDisplay.textContent = `Puntos: ${score}`;
            feedbackPanel.classList.add('success', 'show');
            feedbackText.textContent = `¡Korrekt! ${questions[currentQuestion].explanation}`;
        } else {
            button.classList.add('wrong', 'shake-anim');
            allButtons[correctIndex].classList.add('correct'); 
            feedbackPanel.classList.add('error', 'show');
            feedbackText.textContent = `Falsch. ${questions[currentQuestion].explanation}`;
            
            tutoringAlert.classList.remove('hidden');
            tutoringAlert.innerHTML = `⚠️ Fallo detectado. El sistema ha registrado esta deficiencia para su inclusión en el <strong>Modelo de Evaluación Docente para Tutorías Académicas</strong>.`;
        }

        nextBtn.classList.remove('hidden');
    };

    const forceEndGame = () => {
        answered = true;
        optionsGrid.innerHTML = '';
        questionText.textContent = '⏱️ Tiempo agotado.';
        feedbackPanel.className = 'feedback-panel error show';
        feedbackText.textContent = `Tu puntuación final es ${score}/${questions.length * 25}.`;
        nextBtn.classList.add('hidden');
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stage.classList.add('slide-out');
            
            setTimeout(() => {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    loadQuestion();
                } else {
                    clearInterval(timerInterval);
                    progressBar.style.width = '100%';
                    questionText.textContent = 'Evaluación completada.';
                    optionsGrid.innerHTML = '';
                    feedbackPanel.className = 'feedback-panel success show';
                    feedbackText.textContent = `Rendimiento final: ${score} puntos.`;
                    tutoringAlert.classList.add('hidden');
                    nextBtn.classList.add('hidden');
                }
            }, 400); 
        });
    }

    if (stage) {
        startTimer();
        loadQuestion();
    }
})();

// 3. Validación y Envío de Formulario a Google Sheets
const formHandler = (() => {
    const form = document.getElementById('registration-form');
    if (!form) return;
    const successBox = document.getElementById('form-success');
    
    // PEGA AQUÍ LA URL DE TU DESPLIEGUE QUE TERMINA EN /exec
    const SCRIPT_URL = 'https://script.google.com/a/macros/ecci.edu.co/s/AKfycbxVRiSWTfea2i7hUKwI5LvtwHgkKWYI3NoBgIcVzUa2W0nUCPCiFoEPVUeMsuMU88sl/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Enviando matrícula...';
        submitBtn.disabled = true;

        const formData = new URLSearchParams();
        formData.append('nombre', document.getElementById('nombre').value);
        formData.append('telefono', document.getElementById('telefono').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('nivel', document.getElementById('nivel').value);
        formData.append('mensaje', document.getElementById('mensaje').value);

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            form.reset();
            submitBtn.textContent = 'Procesar Matrícula';
            submitBtn.disabled = false;
            
            successBox.classList.remove('hidden');
            setTimeout(() => { successBox.classList.add('hidden'); }, 5000);
        } catch (error) {
            console.error('Error al enviar:', error);
            alert('Hubo un problema al procesar el registro. Inténtalo de nuevo.');
            submitBtn.textContent = 'Procesar Matrícula';
            submitBtn.disabled = false;
        }
    });
})();

// 4. Rastreador de Teclado (Easter Egg) con protección null
const easterEggTracker = (() => {
    let buffer = '';
    const secretWord = 'merequetengue';

    document.addEventListener('keydown', (e) => {
        const secretPage = document.getElementById('easter-egg');
        if (!secretPage) return;

        if (e.key.length !== 1 && e.key !== 'Escape') return;

        if (e.key === 'Escape') {
            secretPage.classList.remove('revealed');
            buffer = ''; 
            return;
        }

        buffer += e.key.toLowerCase();

        if (buffer.length > secretWord.length) {
            buffer = buffer.slice(-secretWord.length);
        }

        if (buffer === secretWord) {
            secretPage.classList.add('revealed');
            buffer = ''; 
        }
    });
})();

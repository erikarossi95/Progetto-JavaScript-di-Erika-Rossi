document.addEventListener('DOMContentLoaded', function() {

    // Stato dell'applicazione: valore corrente del contatore, passo e tema.
    const valoreSalvato = localStorage.getItem('contatoreValore');
    const temaSalvato = localStorage.getItem('contatoreTema');

    const stato = {
        valoreCorrente: valoreSalvato ? parseInt(valoreSalvato, 10) : 0,
        step: 1,
        isDarkMode: temaSalvato === 'dark'
    };

    // Riferimenti agli elementi DOM (popolati in creaInterfaccia).
    let displayValore;
    let pulsanteIncrementa;
    let pulsanteDecrementa;
    let pulsanteReset;
    let inputStep;
    let pulsanteTema;
    let iconaTema; 

    // Aggiorna le classi CSS del display in base al valore.
    function aggiornaColoreDisplay() {
        displayValore.classList.remove('positive', 'negative');
        if (stato.valoreCorrente > 0) {
            displayValore.classList.add('positive');
        } else if (stato.valoreCorrente < 0) {
            displayValore.classList.add('negative');
        }
    }

    // Aggiorna il testo e il colore del display.
    function aggiornaDisplay() {
        displayValore.textContent = stato.valoreCorrente;
        aggiornaColoreDisplay();
    }

    // Salva il valore corrente nel localStorage.
    function salvaValore() {
        localStorage.setItem('contatoreValore', stato.valoreCorrente);
    }

    // Riproduce un suono.
    function playSound(frequency = 220, duration = 0.05) {
        if (!window.audioContext || window.audioContext.state === 'closed') {
            window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(1, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, window.audioContext.currentTime + duration);
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + duration);
    }

    // Incrementa il contatore.
    function incrementa() {
        stato.valoreCorrente += stato.step;
        aggiornaDisplay();
        salvaValore();
        playSound(440, 0.05);
    }

    // Decrementa il contatore.
    function decrementa() {
        stato.valoreCorrente -= stato.step;
        aggiornaDisplay();
        salvaValore();
        playSound(220, 0.05);
    }

    // Resetta il contatore e lo step.
    function reset() {
        stato.valoreCorrente = 0;
        stato.step = 1;
        if (inputStep) {
            inputStep.value = 1;
        }
        aggiornaDisplay();
        salvaValore();
        playSound(660, 0.1);
    }

    // Aggiorna l'icona del tema in base allo stato
    function aggiornaIconaTema() {
        if (iconaTema) {
            iconaTema.classList.remove('fa-sun', 'fa-moon');
            if (stato.isDarkMode) {
                iconaTema.classList.add('fa-moon');
            } else {
                iconaTema.classList.add('fa-sun');
            }
        }
    }

    // Alterna il tema chiaro/scuro.
    function toggleTheme() {
        stato.isDarkMode = !stato.isDarkMode;
        document.body.classList.toggle('dark-mode', stato.isDarkMode);
        localStorage.setItem('contatoreTema', stato.isDarkMode ? 'dark' : 'light');
        aggiornaIconaTema(); 
    }

    // Costruisce l'interfaccia utente.
    function creaInterfaccia() {
        const appRoot = document.getElementById('app');
        if (!appRoot) {
            console.error("Elemento con id 'app' non trovato.");
            return;
        }

        const container = document.createElement('div');
        container.className = 'counter-container';

        displayValore = document.createElement('h1');
        displayValore.className = 'counter-display';
        displayValore.textContent = stato.valoreCorrente;

        const controlli = document.createElement('div');
        controlli.className = 'counter-controls';
        
        pulsanteDecrementa = document.createElement('button');
        pulsanteDecrementa.className = 'btn btn-decrement';
        pulsanteDecrementa.textContent = '−';

        pulsanteIncrementa = document.createElement('button');
        pulsanteIncrementa.className = 'btn btn-increment';
        pulsanteIncrementa.textContent = '+';

        pulsanteReset = document.createElement('button');
        pulsanteReset.className = 'btn btn-reset';
        pulsanteReset.textContent = 'Azzera';

        pulsanteTema = document.createElement('button');
        pulsanteTema.className = 'btn-theme-toggle';
    
        iconaTema = document.createElement('i'); 
        iconaTema.classList.add('fas'); 
        pulsanteTema.appendChild(iconaTema); 
        
        const stepContainer = document.createElement('div');
        stepContainer.className = 'step-container';
        const stepLabel = document.createElement('label');
        stepLabel.setAttribute('for', 'step-input');
        stepLabel.textContent = 'Step:';
        
        inputStep = document.createElement('input');
        inputStep.id = 'step-input';
        inputStep.className = 'step-input';
        inputStep.type = 'number';
        inputStep.value = stato.step;
        inputStep.min = '1';
        inputStep.setAttribute('aria-label', 'Seleziona il valore dello step');

        stepContainer.appendChild(stepLabel);
        stepContainer.appendChild(inputStep);

        controlli.appendChild(pulsanteDecrementa);
        controlli.appendChild(pulsanteIncrementa);
        controlli.appendChild(pulsanteReset);
        
        container.appendChild(displayValore);
        container.appendChild(controlli);
        container.appendChild(stepContainer);

        appRoot.appendChild(pulsanteTema); 
        appRoot.appendChild(container);

        aggiornaDisplay();
        document.body.classList.toggle('dark-mode', stato.isDarkMode);
        aggiornaIconaTema(); 
    }

    // Gestisce gli input da tastiera.
    function handleKeyPress(event) {
        switch (event.key) {
            case '+':
            case 'ArrowUp':
                incrementa();
                event.preventDefault();
                break;
            case '-':
            case 'ArrowDown':
                decrementa();
                event.preventDefault();
                break;
            case 'r':
            case 'R':
                reset();
                event.preventDefault();
                break;
            default:
                break;
        }
    }

    // Inizializzazione dell'applicazione.
    creaInterfaccia();

    // Event listener per i pulsanti.
    pulsanteIncrementa.addEventListener('click', incrementa);
    pulsanteDecrementa.addEventListener('click', decrementa);
    pulsanteReset.addEventListener('click', reset);
    pulsanteTema.addEventListener('click', toggleTheme);

    // Event listener per l'input dello step.
    inputStep.addEventListener('input', function(event) {
        const nuovoStep = parseInt(event.target.value, 10);
        if (!isNaN(nuovoStep) && nuovoStep > 0) {
            stato.step = nuovoStep;
        } else if (event.target.value === '') {
        } else {
            event.target.value = stato.step;
        }
    });

    // Event listener per i tasti della tastiera.
    document.addEventListener('keydown', handleKeyPress);
});

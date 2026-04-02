// Fonction pour afficher une alerte personnalisée sans mention "github.io"
function showAlert(message) {
    const modal = document.getElementById('custom-alert');
    const msgElem = document.getElementById('alert-message');
    if (modal && msgElem) {
        msgElem.textContent = message;
        modal.style.display = 'flex';
    } else {
        // Backup si la modale n'est pas encore dans le HTML
        alert(message);
    }
}

function calculerScore() {
    // 1. VÉRIFICATION DE LA DATE (Nouveau blocage)
    const inputDate = document.getElementById('date-eval');
    if (!inputDate || inputDate.value === "") {
        showAlert("Action bloquée : La Date de l'évaluation doit être renseignée.");
        return; 
    }

    // 2. VÉRIFICATION DE L'ÉVALUATEUR
    const inputEval = document.getElementById('nom-eval');
    if (!inputEval || inputEval.value.trim() === "") {
        showAlert("Action bloquée : Le Nom de l'évaluateur doit être renseigné.");
        return; 
    }

    // 3. VÉRIFICATION DES RÉPONSES (q1 à q5)
    const questions = ['q1', 'q2', 'q3', 'q4', 'q5'];
    let toutesRepondues = true;
    questions.forEach(q => {
        const res = document.querySelector(`input[name="${q}"]:checked`);
        if (!res) { toutesRepondues = false; }
    });

    if (!toutesRepondues) {
        showAlert("Action bloquée : Vous devez répondre à toutes les questions avant de valider.");
        return;
    }

    // --- SI TOUT EST OK, CALCUL DU SCORE ---
    let score = 0;
    
    // Nettoyage des styles précédents
    const labels = document.querySelectorAll('.question-card label');
    labels.forEach(label => {
        label.style.backgroundColor = "transparent";
        label.style.color = "black";
        label.style.fontWeight = "normal";
    });

    // Nettoyage des points affichés (+20 / +0)
    for (let i = 1; i <= 5; i++) {
        const span = document.getElementById(`res-q${i}`);
        if (span) span.textContent = "";
    }

    // --- LOGIQUE QUESTION 1 ---
    const q1_SITADOC = document.querySelector('input[name="q1"][value="SITADOC"]');
    const q1_IATA = document.querySelector('input[name="q1"][value="IATA"]');
    const q1_REPLI = document.querySelector('input[name="q1"][value="REPLI"]');
    const resQ1 = document.getElementById('res-q1');

    // On montre les bonnes réponses en vert [cite: 150, 151]
    q1_SITADOC.parentElement.style.backgroundColor = "#d4edda";
    q1_IATA.parentElement.style.backgroundColor = "#d4edda";

    if (!q1_REPLI.checked && (q1_SITADOC.checked || q1_IATA.checked)) {
        score += 20;
        if (resQ1) { resQ1.textContent = "+20 pts"; resQ1.style.color = "green"; }
    } else {
        if (resQ1) { resQ1.textContent = "+0 pt"; resQ1.style.color = "red"; }
        if (q1_REPLI.checked) {
            q1_REPLI.parentElement.style.backgroundColor = "#f8d7da";
            q1_REPLI.parentElement.style.color = "#721c24";
        }
    }

    // --- LOGIQUE QUESTIONS 2 À 5 ---
    const solutions = {
        q2: "Toxique",
        q3: "Une cigarette électronique",
        q4: "Je préviens un responsable + périmètre de sécurité de 25m",
        q5: "Une boîte sécurisée de cartouches de chasse (4.5Kg brut)"
    };

    for (let i = 2; i <= 5; i++) {
        const qName = `q${i}`;
        const radios = document.querySelectorAll(`input[name="${qName}"]`);
        const userChoice = document.querySelector(`input[name="${qName}"]:checked`);
        const resSpan = document.getElementById(`res-q${i}`);
        let isCorrect = false;

        // Colorer la bonne réponse en vert [cite: 58]
        radios.forEach(r => {
            if (r.parentElement.textContent.trim().includes(solutions[qName])) {
                r.parentElement.style.backgroundColor = "#d4edda";
                r.parentElement.style.fontWeight = "bold";
            }
        });

        // Colorer l'erreur en rouge si le choix utilisateur est incorrect
        if (userChoice.parentElement.textContent.trim().includes(solutions[qName])) {
            score += 20;
            isCorrect = true;
        } else {
            userChoice.parentElement.style.backgroundColor = "#f8d7da";
            userChoice.parentElement.style.color = "#721c24";
        }

        if (resSpan) {
            resSpan.textContent = isCorrect ? "+20 pts" : "+0 pt";
            resSpan.style.color = isCorrect ? "green" : "red";
        }
    }

    // --- AFFICHAGE TOTAL ---
    const pct = (score / 100) * 100;
    document.getElementById('points-result').textContent = score;
    document.getElementById('percent-result').textContent = pct;

    const status = document.getElementById('status-result');
    if (pct >= 80) {
        status.innerHTML = "<strong>✅ L'évaluation a été validée.</strong>"; // [cite: 144]
        status.style.color = "green";
    } else {
        status.innerHTML = "<strong>❌ L'évaluation n'a pas été validée.</strong>"; // 
        status.style.color = "red";
    }
}

function genererPDF() {
    const element = document.getElementById('document-to-print');
    const btnArea = document.querySelector('.btn-area');

    // Masquer boutons
    if (btnArea) btnArea.style.display = 'none';

    // Synchronisation inputs
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.checked) input.setAttribute('checked', 'checked');
            else input.removeAttribute('checked');
        } else {
            input.setAttribute('value', input.value);
        }
    });

    const nom = document.getElementById('nom-agent').value || "Agent";

function genererPDF() {
    const element = document.getElementById('document-to-print');
    const btnArea = document.querySelector('.btn-area');

    // Sécurité : vérifier html2pdf
    if (typeof html2pdf === "undefined") {
        showAlert("Erreur : la librairie PDF n'est pas chargée.");
        console.error("html2pdf non chargé");
        return;
    }

    // Masquer boutons
    if (btnArea) btnArea.style.display = 'none';

    // Synchronisation inputs
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.checked) input.setAttribute('checked', 'checked');
            else input.removeAttribute('checked');
        } else {
            input.setAttribute('value', input.value);
        }
    });

    const nomInput = document.getElementById('nom-agent');
    const nom = nomInput && nomInput.value ? nomInput.value : "Agent";

    const opt = {
        margin: 5,
        filename: `EVAL_DGR_${nom}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 1,
            useCORS: true,
            scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        if (btnArea) btnArea.style.display = 'block';
    }).catch(err => {
        if (btnArea) btnArea.style.display = 'block';
        console.error("Erreur PDF:", err);
        showAlert("Erreur lors de la génération du PDF.");
    });
}

function envoyerEmail() {
    const nom = document.getElementById('nom-agent').value;
    const score = document.getElementById('points-result').textContent;
    const statusText = document.getElementById('status-result').innerText;
    
    const sujet = encodeURIComponent(`Évaluation DGR 7.5 - ${nom}`);
    const corps = encodeURIComponent(`Agent : ${nom}\nScore : ${score}/100\nRésultat : ${statusText}`);
    window.location.href = `mailto:xavier.oliere@alyzia.com?subject=${sujet}&body=${corps}`;
}
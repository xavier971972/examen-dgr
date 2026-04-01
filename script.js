function calculerScore() {
    let score = 0;

    // Q1: SITADOC ou IATA = 20pts. Si REPLI coché = 0pt.
    const q1_SITADOC = document.querySelector('input[name="q1"][value="SITADOC"]').checked;
    const q1_IATA = document.querySelector('input[name="q1"][value="IATA"]').checked;
    const q1_REPLI = document.querySelector('input[name="q1"][value="REPLI"]').checked;

    if (!q1_REPLI && (q1_SITADOC || q1_IATA)) {
        score += 20;
    }

    const solutions = {
        q2: "Toxique",
        q3: "Une cigarette électronique",
        q4: "Je préviens un responsable + périmètre de sécurité de 25m",
        q5: "Une boîte sécurisée de cartouches de chasse (4.5Kg brut)"
    };

    for (let i = 2; i <= 5; i++) {
        const check = document.querySelector(`input[name="q${i}"]:checked`);
        if (check && check.parentElement.textContent.trim().includes(solutions[`q${i}`])) {
            score += 20;
        }
    }

    const pct = (score / 100) * 100;
    document.getElementById('points-result').textContent = score;
    document.getElementById('percent-result').textContent = pct;

    const status = document.getElementById('status-result');
    if (pct >= 80) {
        status.innerHTML = "<strong>✅ L'évaluation a été validée.</strong>";
        status.style.color = "green";
    } else {
        status.innerHTML = "<strong>❌ L'évaluation n'a pas été validée.</strong>";
        status.style.color = "red";
    }
}

function genererPDF() {
    const element = document.getElementById('document-to-print');
    
    // Synchronisation forcée des données pour le rendu PDF
    const inputs = element.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.checked) input.setAttribute('checked', 'checked');
            else input.removeAttribute('checked');
        } else {
            input.setAttribute('value', input.value);
            if (input.tagName === 'TEXTAREA') input.innerHTML = input.value;
        }
    });

    const nom = document.getElementById('nom-agent').value || "Agent";
    const prenom = document.getElementById('prenom-agent').value || "";

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `EVAL_DGR_${nom}_${prenom}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            scrollY: 0 // Assure que la capture commence en haut de page
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        // Paramètres de saut de page pour éviter les coupures nettes
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
}

function envoyerEmail() {
    const nom = document.getElementById('nom-agent').value;
    const score = document.getElementById('points-result').textContent;
    const statusText = document.getElementById('status-result').innerText;
    
    const sujet = encodeURIComponent(`Évaluation DGR 7.5 - ${nom}`);
    const corps = encodeURIComponent(`Agent : ${nom}\nScore : ${score}/100\nRésultat : ${statusText}`);
    window.location.href = `mailto:xavier.oliere@alyzia.com?subject=${sujet}&body=${corps}`;
}
function calculerScore() {
    let score = 0;

    // Q1: SITADOC ou IATA = 20pts. Si REPLI coché = 0pt.
    const q1_SITADOC = document.querySelector('input[name="q1"][value="SITADOC"]').checked;
    const q1_IATA = document.querySelector('input[name="q1"][value="IATA"]').checked;
    const q1_REPLI = document.querySelector('input[name="q1"][value="REPLI"]').checked;

    if (!q1_REPLI && (q1_SITADOC || q1_IATA)) {
        score += 20;
    }

    // Solutions Questions 2-5 [cite: 54, 59, 69, 79]
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
        status.innerHTML = "<strong>✅ L'évaluation a été validée.</strong> [cite: 26]";
        status.style.color = "green";
    } else {
        status.innerHTML = "<strong>❌ L'évaluation n'a pas été validée.</strong> [cite: 25]";
        status.style.color = "red";
    }
}

function genererPDF() {
    const element = document.getElementById('document-to-print');
    
    // ÉTAPE CRUCIALE : On synchronise les valeurs saisies (input/textarea) 
    // pour qu'elles soient visibles par le moteur de capture PDF
    const inputs = element.querySelectorAll('input[type="text"], input[type="date"], textarea');
    inputs.forEach(input => {
        input.setAttribute('value', input.value);
        if (input.tagName === 'TEXTAREA') {
            input.innerHTML = input.value;
        }
    });

    const nom = document.getElementById('nom-agent').value || "Agent";
    const prenom = document.getElementById('prenom-agent').value || "";
    
    const opt = {
        margin: [5, 5, 5, 5],
        filename: `EVAL_DGR_${nom}_${prenom}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Utilisation de la promesse pour éviter le rechargement de la page
    html2pdf().set(opt).from(element).save().then(() => {
        console.log("PDF généré avec succès");
    }).catch(err => {
        console.error("Erreur PDF:", err);
        alert("Erreur lors de la génération du PDF. Assurez-vous d'être connecté à Internet.");
    });
}

function envoyerEmail() {
    const nom = document.getElementById('nom-agent').value;
    const prenom = document.getElementById('prenom-agent').value;
    const date = document.getElementById('date-eval').value;

    if (!nom || !date) {
        alert("Veuillez saisir au moins le Nom et la Date.");
        return;
    }

    const score = document.getElementById('points-result').textContent;
    const destinataire = "xavier.oliere@alyzia.com";
    const sujet = encodeURIComponent(`Évaluation DGR 7.5 - ${nom} ${prenom}`);
    const corps = encodeURIComponent(`Résultats de l'agent : ${nom} ${prenom}\nDate : ${date}\nScore : ${score}/100\n\nCommentaire : ${document.getElementById('commentaire').value}`);

    window.location.href = `mailto:${destinataire}?subject=${sujet}&body=${corps}`;
}
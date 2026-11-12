function showRule(ruleId, clickedButton) {
    const allRules = document.querySelectorAll('.rule-box');
    allRules.forEach(box => {
        box.classList.add('hidden'); // pudełka z zasadami - ukrywa na początku
    });

    const allButtons = document.querySelectorAll('.rule-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('active-btn'); // zdejmuje podświetlenie z przycisków
    });

    document.getElementById(ruleId).classList.remove('hidden');
    clickedButton.classList.add('active-btn'); // odkryj wybraną zasadę
}

const reportForm = document.getElementById('report-form');

if (reportForm) {
    const feedback = document.getElementById('form-feedback');
    const reportsList = document.getElementById('reports-list');

    // czytanie tablicy zgłoszeń, lub tworzenie jej, jesli pusta
    let reports = JSON.parse(localStorage.getItem('walkerReportsList')) || [];

    // rysujemy historię na ekranie
    function renderReports() {
        reportsList.innerHTML = ''; // czyścimy widok przed narysowaniem

        if (reports.length === 0) {
            reportsList.textContent = 'No reports logged yet. Be the first vigilant citizen.';
            return;
        }

        reports.forEach(item => {
            const card = document.createElement('div');
            card.className = 'report-card';

            const meta = document.createElement('div');
            meta.className = 'report-meta';
            meta.textContent = `${item.timestamp} • ${item.email}`;

            const type = document.createElement('div');
            type.className = 'report-type';
            type.textContent = item.crimeLabel;

            const text = document.createElement('p');
            text.className = 'report-text';
            text.textContent = item.message;

            card.appendChild(meta);
            card.appendChild(type);
            card.appendChild(text);
            reportsList.appendChild(card);
        });
    }

    // wyświetlamy historię po załadowaniu strony
    renderReports();

    reportForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const crimeSelect = document.getElementById('what_crime_select');
        const crimeLabel = crimeSelect.options[crimeSelect.selectedIndex].text;
        const message = document.getElementById('message').value.trim();

        if (message.length < 15) {
            feedback.textContent = 'Error: Please provide at least 15 real characters describing the incident.';
            return;
        }

        // tworzymy obiekt pojedynczego zgłoszenia
        const newReport = {
            timestamp: new Date().toLocaleString('pl-PL'),
            email: email,
            crimeLabel: crimeLabel,
            message: message
        };

        // wstawiamy na SAM POCZĄTEK TABLICY (format CV)
        reports.unshift(newReport);

        // zapisujemy tablicę po aktualizacji
        localStorage.setItem('walkerReportsList', JSON.stringify(reports));

        // refresh listy, pokazujemy komunikat, czyścimy formularz
        renderReports();
        feedback.textContent = `Report logged! Total cases on record: ${reports.length}.`;
        reportForm.reset();
    });
}

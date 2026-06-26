document.addEventListener('DOMContentLoaded', async () => {
    const progressContainer = document.getElementById('progress');

    const response = await fetch('tracker.json?nocache=' + (new Date()).getTime());
    const data = await response.json();

    const table = document.createElement('table');
    table.className = 'progress-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>App</th>
                <th>Status</th>
                <th>Progress</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    const processedData = Object.entries(data).map(([id, app]) => {
        let percentage = 0.01;
        if (app.progress) percentage = app.progress;
        else if (app.declined) percentage = 0;
        else if (app.done) percentage = 100;
        else {
            if (app.tracking_issue) percentage += 9.99;
            if (app.pull_request) percentage += 15;
            if (app.wip) percentage += 30;
            if (app.testing) percentage += 30;
        }

        let reference
        if (app.reference_url) reference = app.reference_url;
        else if (app.pull_request) reference = app.pull_request;
        else if (app.tracking_issue) reference = app.tracking_issue;
        
        let emoji = '🫥';
        if (app.done) emoji = '🥳';
        else if (app.declined) emoji = '🫠';
        else if ((app.pull_request || app.tracking_issue) && !(app.wip || app.testing)) emoji = '🤔';
        else if (app.wip || app.testing) emoji = '🫣';

        let referenceText = 'None ' + emoji;
        if (app.reference_text) referenceText = app.reference_text;
        else if (app.done) referenceText = 'Completed ' + emoji;
        else if (app.declined) referenceText = 'Not Planned ' + emoji;
        else if (app.pull_request) referenceText = 'PR ' + emoji;
        else if (app.tracking_issue) referenceText = 'Issue ' + emoji;
        
        return { ...app, id, percentage, referenceText, reference };
    });

    processedData.sort((a, b) => b.percentage - a.percentage);

    processedData.forEach(app => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><a href="#" class="details-toggle">${app.name} <span class="details-carrot">⌄</span></a></td>
            <td><a href="${app.reference || "#"}" target="_blank">${app.referenceText}</a></td>
            <td>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${app.percentage}%"></div>
                </div>
            </td>
        `;
        tbody.appendChild(row);

        const toggleLink = row.querySelector('.details-toggle');
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();

            const carrot = toggleLink.querySelector('.details-carrot');
            carrot.classList.toggle('flipped');

            const detailsRows = document.querySelectorAll(`.details-${app.id}`);
            
            detailsRows.forEach(detailRow => {
                if (detailRow.style.display === 'table-row') {
                    detailRow.style.display = 'none';
                } else {
                    detailRow.style.display = 'table-row';
                }
            });
        });

        const homepage = addDetailEntry(tbody, "Home", app.url, app.id);
        let bottomRow = homepage;

        if (app.tracking_issue) {
            const issue = addDetailEntry(tbody, "Issue", app.tracking_issue, app.id);
            bottomRow = issue;
        }

        if (app.pull_request) {
            const pr = addDetailEntry(tbody, "PR", app.pull_request, app.id);
            bottomRow = pr;
        }

        if (app.reference_url) {
            const ref = addDetailEntry(tbody, "Extra", app.reference_url, app.id);
            bottomRow = ref;
        }

        bottomRow.classList.add('details-bottom-row')

    });

    progressContainer.appendChild(table);
});

function addDetailEntry(tbody, name, url, id) {
    const row = document.createElement('tr');
    row.classList.add("details", "details-" + id);

    row.innerHTML = `
        <td>${name} </td><td colspan="2"><a class="details-link" href="${url}" target="_blank">${getReadableUrl(url)}</a></td>
    `;
    tbody.appendChild(row);
    return row
}

function getReadableUrl(url) {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
}
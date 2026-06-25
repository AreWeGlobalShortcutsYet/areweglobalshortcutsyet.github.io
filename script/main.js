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

        const homepage = document.createElement('tr');
        homepage.classList.add("details", "details-" + app.id);

        homepage.innerHTML = `
            <td>Home </td><td colspan="2"><a href="${app.url}" target="_blank">${app.url}</a></td>
        `;
        tbody.appendChild(homepage);

        let bottomRow = homepage;

        if (app.tracking_issue) {
            const issue = document.createElement('tr');
            issue.classList.add("details", "details-" + app.id);
    
            issue.innerHTML = `
                <td>Issue </td><td colspan="2"><a href="${app.tracking_issue}" target="_blank">${app.tracking_issue}</a></td>
            `;
            tbody.appendChild(issue);
            bottomRow = issue;
        }

        if (app.pull_request) {
            const pr = document.createElement('tr');
            pr.classList.add("details", "details-" + app.id);
    
            pr.innerHTML = `
                <td>PR </td><td colspan="2"><a href="${app.pull_request}" target="_blank">${app.pull_request}</a></td>
            `;
            tbody.appendChild(pr);
            bottomRow = pr;
        }

        if (app.reference_url) {
            const ref = document.createElement('tr');
            ref.classList.add("details", "details-" + app.id);
    
            ref.innerHTML = `
                <td>Extra </td><td colspan="2"><a href="${app.reference_url}" target="_blank">${app.reference_url}</a></td>
            `;
            tbody.appendChild(ref);
            bottomRow = ref;
        }

        bottomRow.classList.add('details-bottom-row')

    });

    progressContainer.appendChild(table);
});
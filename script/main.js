document.addEventListener('DOMContentLoaded', async () => {
    const progressContainer = document.getElementById('progress');

    const response = await fetch('tracker.json');
    const data = await response.json();

    const table = document.createElement('table');
    table.className = 'progress-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>App</th>
                <th>Reference</th>
                <th>Progress</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    const processedData = Object.values(data).map(app => {
        let percentage = 0.01;
        if (app.declined) {
            percentage = 0;
        } else if (app.done) {
            percentage = 100;
        } else {
            if (app.tracking_issue) percentage += 9.99;
            if (app.pull_request) percentage += 15;
            if (app.wip) percentage += 30;
            if (app.testing) percentage += 30;
        }

        let reference = app.pull_request || app.tracking_issue;

        let emoji = '🫥';
        if (app.done) emoji = '🥳';
        else if (app.declined) emoji = '🫠';
        else if ((app.pull_request || app.tracking_issue) && !(app.wip || app.testing)) emoji = '🤔';
        else if (app.wip || app.testing) emoji = '🫣';

        let referenceText = 'None ' + emoji;
        if (app.done) referenceText = 'Completed ' + emoji;
        else if (app.declined) referenceText = 'Not Planned ' + emoji;
        else if (app.pull_request) referenceText = 'PR ' + emoji;
        else if (app.tracking_issue) referenceText = 'Issue ' + emoji;
        
        return { ...app, percentage, referenceText, reference };
    });

    processedData.sort((a, b) => b.percentage - a.percentage);

    processedData.forEach(app => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><a href="${app.url}" target="_blank">${app.name}</a></td>
            <td class="reference-cell"><a href="${app.reference || "#"}" target="_blank">${app.referenceText}</a></td>
            <td>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${app.percentage}%"></div>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    progressContainer.appendChild(table);
});
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
                <th>Issue</th>  
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
            if (app.wip) percentage += 30;  
            if (app.testing) percentage += 30;  
        }

        let emoji = '🫥';  
        if (app.done) emoji = '🥳';  
        else if (app.declined) emoji = '🫠';  
        else if (app.wip || app.testing || app.tracking_issue) emoji = '🫣';

        return { ...app, percentage, emoji };
    });

    processedData.sort((a, b) => b.percentage - a.percentage);

    processedData.forEach(app => {  
        const row = document.createElement('tr');  
  
        row.innerHTML = `  
            <td><a href="${app.url}" target="_blank">${app.name}</a></td>  
            <td class="emoji-cell"><a href="${app.tracking_issue}" target="_blank">${app.emoji}</a></td>  
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
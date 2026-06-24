document.addEventListener('DOMContentLoaded', async () => {
    let trackerData = {};

    const appSelector = document.getElementById('app-selector');
    const editor = document.getElementById('editor');
    const outputContainer = document.getElementById('output-container');
    const jsonResult = document.getElementById('json-result');

    const fields = {
        id: document.getElementById('field-id'),
        name: document.getElementById('field-name'),
        url: document.getElementById('field-url'),
        issue: document.getElementById('field-issue'),
        pr: document.getElementById('field-pr'),
        wip: document.getElementById('field-wip'),
        testing: document.getElementById('field-testing'),
        done: document.getElementById('field-done'),
        declined: document.getElementById('field-declined')
    };

    const response = await fetch('tracker.json');
    trackerData = await response.json();
    updateSelector();

    function updateSelector() {
        appSelector.innerHTML = '<option value="">Edit</option>';
        Object.keys(trackerData).forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = trackerData[id].name;
            appSelector.appendChild(option);
        });
    }

    function showEditor(mode, id = null) {
        editor.style.display = 'block';
        outputContainer.style.display = 'none';

        if (mode === 'new') {
            document.getElementById('editor-title').textContent = "Add Application";
            fields.id.value = "";
            fields.id.disabled = false;
            fields.name.value = "";
            fields.url.value = "";
            fields.issue.value = "";
            fields.pr.value = "";
            fields.wip.checked = false;
            fields.testing.checked = false;
            fields.done.checked = false;
            fields.declined.checked = false;
        } else {
            const app = trackerData[id];
            document.getElementById('editor-title').textContent = `Editing ${id}`;
            fields.id.value = id;
            fields.id.disabled = true;
            fields.name.value = app.name || "";
            fields.url.value = app.url || "";
            fields.issue.value = app.tracking_issue || "";
            fields.pr.value = app.pull_request || "";
            fields.wip.checked = !!app.wip;
            fields.testing.checked = !!app.testing;
            fields.done.checked = !!app.done;
            fields.declined.checked = !!app.declined;
        }
    }

    document.getElementById('btn-new').addEventListener('click', () => showEditor('new'));

    appSelector.addEventListener('change', (e) => {
        if (e.target.value) showEditor('edit', e.target.value);
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        editor.style.display = 'none';
    });

    document.getElementById('btn-submit').addEventListener('click', () => {
        const id = fields.id.value.trim();
        const name = fields.name.value.trim();
        const url = fields.url.value.trim();
        const done = fields.done.checked;
        const declined = fields.declined.checked;

        if (!id) {
            alert("ID is required");
            return;
        }
        else if (!name) {
            alert("Name is required");
            return;
        }
        else if (!url) {
            alert("URL is required");
            return;
        }
        else if (done && declined) {
            alert("Can't be done and declined simultaneously");
            return;
        }
        else if (id in trackerData) {
            if (!confirm(`Overwrite entry "${id}"?`))
                return;
        }

        trackerData[id] = {
            name: name,
            url: url
        };

        if (fields.issue.value) {
            trackerData[id]['tracking_issue'] = fields.issue.value.trim();
        }

        if (fields.pr.value) {
            trackerData[id]['pull_request'] = fields.pr.value.trim();
        }

        if (fields.wip.checked) {
            trackerData[id]['wip'] = fields.wip.checked;
        }

        if (fields.testing.checked) {
            trackerData[id]['testing'] = fields.testing.checked;
        }

        if (fields.done.checked) {
            trackerData[id]['done'] = fields.done.checked;
        }

        if (fields.declined.checked) {
            trackerData[id]['declined'] = fields.wip.declined;
        }

        if (!trackerData[id].tracking_issue) delete trackerData[id].tracking_issue;
        if (!trackerData[id].pull_request) delete trackerData[id].pull_request;

        updateSelector();
        showOutput();
    });

    function showOutput() {
        editor.style.display = 'none';
        outputContainer.style.display = 'block';
        jsonResult.value = JSON.stringify(trackerData, null, 4).replace(/},\n/g, "},\n\n");
    }

    document.getElementById('btn-copy').addEventListener('click', () => {
        jsonResult.select();
        navigator.clipboard.writeText(jsonResult.value);
        const btn = document.getElementById('btn-copy');
        btn.textContent = "Copied!";
        setTimeout(() => btn.textContent = "Copy JSON", 2000);
    });
});
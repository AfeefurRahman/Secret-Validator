// CyberCorp: Audit After Hours — static edition
const $ = id => document.getElementById(id);
const el = (tag, text = '', className = '') => {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
};

const recoveryBytes = [84, 67, 81, 108, 118, 113, 99, 114, 101, 72, 127, 120, 98, 101, 100, 72, 118, 98, 115, 126, 99, 106];
const recover = () => recoveryBytes.map(byte => String.fromCharCode(byte ^ 23)).join('');

const invoices = [
    { id: 101, vendor: 'Northstar Supplies', amount: '$1,250.00', status: 'Paid', memo: 'Routine office supply order.' },
    { id: 102, vendor: 'Beacon IT Services', amount: '$890.00', status: 'Pending', memo: 'Maintenance for the finance workstation.' },
    { id: 103, vendor: 'Archive Logistics', amount: '$420.00', status: 'Reviewed', memo: 'Audit note: a fourth invoice was removed from the visitor listing, but its record number is still 104.' },
    { id: 104, vendor: 'CyberCorp Internal Audit', amount: '$0.00', status: 'RESTRICTED', memo: null }
];

let sessionStarted = false;

function view(id) {
    try {
        if (!sessionStarted) throw new Error('Start a visitor session first.');
        const invoice = invoices.find(item => item.id === Number(id));
        if (!invoice) throw new Error('Invoice not found.');
        const record = el('div', '', 'record');
        record.append(
            el('small', `INVOICE #${invoice.id}`),
            el('h3', invoice.vendor),
            el('p', `${invoice.amount} · ${invoice.status}`),
            el('p', invoice.id === 104 ? `AUDIT RECOVERY CODE: ${recover()}` : invoice.memo, 'memo')
        );
        $('detail').replaceChildren(record);
        $('status').textContent = '';
    } catch (error) {
        $('status').textContent = error.message;
    }
}

$('start').addEventListener('click', () => {
    sessionStarted = true;
    $('invoices').replaceChildren();
    for (const invoice of invoices.filter(item => item.id !== 104)) {
        const row = el('div', '', 'row');
        const text = el('div');
        const viewButton = el('button', 'View ↗', 'secondary');
        viewButton.type = 'button';
        text.append(
            el('small', `INVOICE #${invoice.id}`),
            el('h3', invoice.vendor),
            el('span', `${invoice.amount} · ${invoice.status}`, 'muted')
        );
        viewButton.addEventListener('click', () => view(invoice.id));
        row.append(text, viewButton);
        $('invoices').append(row);
    }
    $('session-label').textContent = 'VISITOR';
    $('status').textContent = 'Visitor workspace ready.';
    $('start').textContent = 'Refresh workspace ↻';
});

$('submission').addEventListener('submit', event => {
    event.preventDefault();
    const supplied = $('flag').value.trim();
    const accepted = supplied === recover();
    $('status').textContent = accepted
        ? '✓ Flag accepted. Audit complete.'
        : 'That flag is not correct. Keep investigating.';
});

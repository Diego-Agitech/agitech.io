// Ported verbatim from odoo-budget-estimator/server/templates/emailTemplates.js
function renderBudgetTable(budget: any): string {
  if (!budget) return '<p>No budget data available.</p>';
  const capex = budget.capex || {};
  const opex = budget.opex || {};
  return `
    <h3>Budget Summary</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-bottom: 16px;">
      <tr><th colspan="2">CAPEX (One-time)</th></tr>
      <tr><td>Total</td><td><b>${capex.total ? capex.total + ' €' : 'N/A'}</b></td></tr>
      <tr><td>Hours</td><td>${capex.hours || 'N/A'}</td></tr>
      ${capex.breakdown && Object.keys(capex.breakdown).length > 0 ? Object.entries(capex.breakdown).map(([k, v]) => `<tr><td>${k}</td><td>${v} h</td></tr>`).join('') : ''}
      <tr><th colspan="2">OPEX (Yearly)</th></tr>
      <tr><td>Total</td><td><b>${opex.total ? opex.total + ' €' : 'N/A'}</b></td></tr>
      <tr><td>License</td><td>${opex.license || 'N/A'}</td></tr>
      <tr><td>Hosting</td><td>${opex.hosting || 'N/A'}</td></tr>
      <tr><td>Maintenance</td><td>${opex.maintenance || 'N/A'}</td></tr>
      <tr><td>Support</td><td>${opex.support || 'N/A'}</td></tr>
    </table>
  `;
}

function renderEnvironmentSetup(env: any): string {
  if (!env) return '<p>No environment setup data available.</p>';
  return `
    <h3>Environment Setup:</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-bottom: 16px;">
      <tr><td><strong>Multi-company</strong></td><td>${env.multicompany ? 'Yes' : 'No'}</td></tr>
      <tr><td><strong>Email Provider</strong></td><td>${env.email || 'Not specified'}</td></tr>
      <tr><td><strong>Number of Users</strong></td><td>${env.users || 'Not specified'}</td></tr>
      <tr><td><strong>Number of Products</strong></td><td>${env.products || 'Not specified'}</td></tr>
      <tr><td><strong>Number of Companies</strong></td><td>${env.companies || 'Not specified'}</td></tr>
      <tr><td><strong>Production Centers</strong></td><td>${env.productionCenters || 'Not specified'}</td></tr>
      <tr><td><strong>Work Centers</strong></td><td>${env.workcenters || 'Not specified'}</td></tr>
      <tr><td><strong>Quality Checks</strong></td><td>${env.qualityChecks ? 'Yes' : 'No'}</td></tr>
      <tr><td><strong>Manufactured Components</strong></td><td>${env.manufacturedComponents ? 'Yes' : 'No'}</td></tr>
    </table>
  `;
}

function renderAccountingDetails(accounting: any): string {
  if (!accounting) return '';
  return `
    <h3>Accounting Configuration:</h3>
    <ul>
      <li><strong>Type:</strong> ${accounting.type === 'light' ? 'Light Accounting' : 'Full Accounting'}</li>
      <li><strong>Previous Software:</strong> ${accounting.hasPreviousSoftware ? 'Yes' : 'No'}</li>
    </ul>
  `;
}

function renderDataMigrationDetails(migration: any): string {
  if (!migration || migration.source === 'none') return '';
  return `
    <h3>Data Migration Details:</h3>
    <ul>
      <li><strong>Source:</strong> ${migration.source ? migration.source.toUpperCase() : 'Not specified'}</li>
      <li><strong>Objects to Migrate:</strong> ${migration.objects && Array.isArray(migration.objects) && migration.objects.length > 0 ? migration.objects.join(', ') : 'None specified'}</li>
      <li><strong>Product Variants:</strong> ${migration.productVariants || 'Not specified'}</li>
      <li><strong>Record Counts:</strong> ${migration.recordCounts && typeof migration.recordCounts === 'object' && Object.keys(migration.recordCounts).length > 0 ? Object.entries(migration.recordCounts).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Not specified'}</li>
    </ul>
  `;
}

function renderHostingDetails(hosting: any): string {
  if (!hosting) return '';
  const typeMap: Record<string, string> = {
    online: 'Odoo Online',
    sh: 'Odoo.sh',
    onprem: 'On-Premise',
  };
  return `
    <h3>Hosting Configuration:</h3>
    <ul>
      <li><strong>Type:</strong> ${typeMap[hosting.type] || hosting.type || 'Not specified'}</li>
      <li><strong>Users:</strong> ${hosting.users || 'Not specified'}</li>
    </ul>
  `;
}

function renderMaintenanceDetails(maintenance: any): string {
  if (!maintenance) return '';
  return `
    <h3>Maintenance & Support:</h3>
    <ul>
      <li><strong>Hours per Month:</strong> ${maintenance.hoursPerMonth || 'Not specified'}</li>
      <li><strong>Evolutive Maintenance:</strong> ${maintenance.evolutive ? 'Yes' : 'No'}</li>
    </ul>
  `;
}

export function getEstimateEmailTemplate(contactInfo: any, estimateData: any): { subject: string; html: string } {
  const safeContactInfo = contactInfo || {};
  const safeEstimateData = estimateData || {};

  const subject = `New Odoo Estimate Request from ${safeContactInfo.company || 'Unknown Company'}`;

  const html = `
    <h2>New Odoo Estimate Request</h2>

    <h3>Contact Information:</h3>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; margin-bottom: 16px;">
      <tr><td><strong>Name</strong></td><td>${safeContactInfo.fullName || 'Not provided'}</td></tr>
      <tr><td><strong>Email</strong></td><td>${safeContactInfo.email || 'Not provided'}</td></tr>
      <tr><td><strong>Company</strong></td><td>${safeContactInfo.company || 'Not provided'}</td></tr>
      <tr><td><strong>Implementation Timeline</strong></td><td>${safeContactInfo.implementationTimeline || 'Not specified'}</td></tr>
    </table>

    <h3>Selected Applications:</h3>
    <ul>
      ${safeEstimateData.selectedApps && Array.isArray(safeEstimateData.selectedApps) && safeEstimateData.selectedApps.length > 0 ? safeEstimateData.selectedApps.map((app: string) => `<li>${app}</li>`).join('') : '<li>No applications selected</li>'}
    </ul>

    ${renderEnvironmentSetup(safeEstimateData.environmentSetup)}

    ${renderAccountingDetails(safeEstimateData.accounting)}

    <h3>Additional Services:</h3>
    <ul>
      ${safeEstimateData.integrations && Array.isArray(safeEstimateData.integrations) && safeEstimateData.integrations.length > 0 ? `<li><strong>Custom Integrations:</strong> ${safeEstimateData.integrations.join(', ')}</li>` : ''}
      ${safeEstimateData.customDev && Array.isArray(safeEstimateData.customDev) && safeEstimateData.customDev.length > 0 ? `<li><strong>Custom Development:</strong> ${safeEstimateData.customDev.join(', ')}</li>` : ''}
      ${safeEstimateData.iot && safeEstimateData.iot.needed ? `<li><strong>IoT Integration:</strong> Yes (${safeEstimateData.iot.devices && Array.isArray(safeEstimateData.iot.devices) && safeEstimateData.iot.devices.length > 0 ? safeEstimateData.iot.devices.join(', ') : 'Devices not specified'})</li>` : ''}
    </ul>

    ${renderDataMigrationDetails(safeEstimateData.dataMigration)}
    ${renderHostingDetails(safeEstimateData.hosting)}
    ${renderMaintenanceDetails(safeEstimateData.maintenance)}

    ${renderBudgetTable(safeEstimateData.budget)}
  `;

  return { subject, html };
}

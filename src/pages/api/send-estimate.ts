// Ported from odoo-budget-estimator/server/server.js POST /api/send-estimate.
// Serves the /simulateur/ static app (also copied into this project) so the
// whole flow lives on agitech.io — one domain, no cross-origin call.
import type { APIRoute } from 'astro';
import { connectDb, UserResponse } from '../../lib/estimator/db';
import { sendEstimateEmail } from '../../lib/estimator/emailService';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { contactInfo, selectedApps, environmentSetup, accounting, integrations, customDev, dataMigration, iot, hosting, maintenance, budget } = body;

    // Save to DB — non-fatal: an estimate should still email even if the DB write fails.
    try {
      await connectDb();
      await new UserResponse({ ...body, budget: budget || { capex: {}, opex: {} } }).save();
    } catch (dbError) {
      console.error('send-estimate: DB save failed, continuing with email:', dbError);
    }

    const result = await sendEstimateEmail(contactInfo, {
      selectedApps, environmentSetup, accounting, integrations, customDev, dataMigration, iot, hosting, maintenance, budget,
    });

    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    const isValidationError = /Missing required|configuration is invalid|Valid email is required/.test(error.message || '');
    return new Response(
      JSON.stringify({ success: false, message: isValidationError ? error.message : 'Failed to process estimate', error: error.message }),
      { status: isValidationError ? 400 : 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

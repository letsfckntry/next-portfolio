import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasRecipientEmail: !!process.env.RECIPIENT_EMAIL,
    resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
    recipientEmail: process.env.RECIPIENT_EMAIL || 'not set'
  });
}

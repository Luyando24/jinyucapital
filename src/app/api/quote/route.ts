import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Fetch all quote requests
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('Quote fetch error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// POST - Create new quote request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      company_name,
      email,
      phone,
      project_type,
      product_interest,
      quantity,
      message,
    } = body;

    if (!first_name || !last_name || !company_name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const { error } = await supabase.from('quote_requests').insert({
      first_name,
      last_name,
      company_name,
      email,
      phone: phone || null,
      project_type: project_type || null,
      product_interest: product_interest || null,
      quantity: quantity ? parseInt(quantity, 10) : null,
      message,
      status: 'new',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Quote submit error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

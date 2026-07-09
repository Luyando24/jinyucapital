import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_name,
      country,
      business_type,
      contact_name,
      email,
      phone,
      experience,
      products,
      message,
    } = body;

    if (!company_name || !contact_name || !email) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const { error } = await supabase.from('distributor_applications').insert({
      company_name,
      country: country || null,
      business_type: business_type || null,
      contact_name,
      email,
      phone: phone || null,
      experience: experience || null,
      products: products || null,
      message: message || null,
      status: 'new',
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Distributor submit error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

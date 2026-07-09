import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PUT - Update quote request
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, message, quantity, product_interest } = body;

    const { error } = await supabase
      .from('quote_requests')
      .update({
        status,
        message,
        quantity: quantity ? parseInt(quantity, 10) : undefined,
        product_interest,
      })
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Quote update error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE - Delete quote request
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Quote delete error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

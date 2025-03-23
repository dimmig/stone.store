import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userDetails = {
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St',
      city: 'New York',
      country: 'US',
      postalCode: '10001',
    };

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
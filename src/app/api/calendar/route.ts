import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, date, time, config } = body;

    // TODO: Integrate with Google Calendar API
    // const calendar = google.calendar({ version: 'v3', auth });
    // const event = await calendar.events.insert({
    //   calendarId: process.env.GOOGLE_CALENDAR_ID,
    //   requestBody: {
    //     summary: `Audyt NEXBE - ${name}`,
    //     description: `Audyt techniczny...`,
    //     start: { dateTime: `${date}T${time}:00` },
    //     end: { dateTime: `${date}T${endTime}:00` },
    //     location: 'Rozmowa telefoniczna',
    //   },
    // });

    console.log('Audit booked:', { name, email, date, time });

    return NextResponse.json({
      success: true,
      message: 'Audyt umowiony pomyslnie',
    });
  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json(
      { error: 'Blad rezerwacji audytu' },
      { status: 500 }
    );
  }
}

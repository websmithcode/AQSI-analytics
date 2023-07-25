type event = {
	url: string;
};

export async function GET(event: event) {
	const options: ResponseInit = {
		status: 200
	};

	const parsedUrl = new URL(event.url);

	const targetUrl = atob(parsedUrl.searchParams.get('url') ?? '');
	const apiKey = atob(parsedUrl.searchParams.get('key') ?? '');
	console.log({
		targetUrl,
		apiKey
	});

	if (!targetUrl || !apiKey) {
		return new Response(JSON.stringify({ error: 'No url or key provided' }), { status: 400 });
	}

	// Proxy request to targetUrl
	const init: RequestInit = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'x-client-key': `Application ${apiKey}`
		}
	};

	const response = await fetch(targetUrl, init);
	const data = await response.text();
	console.log({ url: event.url, targetUrl });

	return new Response(data, options);
}

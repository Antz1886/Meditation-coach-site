import httpx
import os

ZAPIER_WEBHOOK_URL = os.getenv("ZAPIER_ZOHO_WEBHOOK")

async def push_to_zoho(user_data: dict):
    """
    Pushes session data and lead info to Zoho CRM via Zapier.
    """
    if not ZAPIER_WEBHOOK_URL:
        return {"status": "error", "message": "Webhook URL not configured"}

    async with httpx.AsyncClient() as client:
        response = await client.post(ZAPIER_WEBHOOK_URL, json=user_data)
        return response.json()

import resend
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_email(to: str, subject: str, html_body: str):
    """Send an HTML email via Resend."""
    try:
        print(f"📧 Attempting to send email to {to}...")
        print(f"RESEND_API_KEY length: {len(settings.RESEND_API_KEY) if settings.RESEND_API_KEY else 'NOT SET'}")

        params = {
            "from": "CivicTide <onboarding@resend.dev>",
            "to": [to],
            "subject": subject,
            "html": html_body,
        }

        response = resend.Emails.send(params)
        print(f"✅ Email sent successfully! ID: {response}")

    except Exception as e:
        print(f"❌ Email sending failed: {type(e).__name__}: {e}")


def send_status_update_email(to: str, name: str, report_title: str, new_status: str, resolution_notes: str = None):
    status_colors = {
        "reported":     "#1a8fe8",
        "under_review": "#f39c12",
        "in_progress":  "#e67e22",
        "resolved":     "#27ae60",
        "rejected":     "#e74c3c",
    }
    status_labels = {
        "reported":     "Reported",
        "under_review": "Under Review",
        "in_progress":  "In Progress",
        "resolved":     "Resolved ✅",
        "rejected":     "Rejected",
    }

    color = status_colors.get(new_status, "#1a8fe8")
    label = status_labels.get(new_status, new_status)

    notes_section = f"""
        <div style="margin-top:16px;padding:16px;background:#f7fafd;border-radius:8px;border-left:4px solid {color};">
            <p style="margin:0;font-size:14px;color:#555;font-weight:600;">Resolution Notes:</p>
            <p style="margin:8px 0 0;font-size:14px;color:#333;">{resolution_notes}</p>
        </div>
    """ if resolution_notes else ""

    html = f"""<!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f7fafd;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,58,102,0.08);">
            <div style="background:linear-gradient(135deg,#0a3a66,#1a8fe8);padding:32px;text-align:center;">
                <h1 style="margin:0;color:white;font-size:28px;font-weight:800;">CivicTide 🌊</h1>
                <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Your Voice. Your Community. Your Change.</p>
            </div>
            <div style="padding:32px;">
                <p style="font-size:16px;color:#0a3a66;margin:0 0 16px;">Hi <strong>{name}</strong>,</p>
                <p style="font-size:15px;color:#555;margin:0 0 24px;">Your report has been updated. Here's the latest status:</p>
                <div style="padding:16px;background:#f7fafd;border-radius:8px;margin-bottom:20px;">
                    <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Report</p>
                    <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:#0a3a66;">{report_title}</p>
                </div>
                <div style="text-align:center;margin:24px 0;">
                    <span style="display:inline-block;padding:10px 28px;background:{color};color:white;border-radius:50px;font-size:16px;font-weight:700;">{label}</span>
                </div>
                {notes_section}
                <div style="text-align:center;margin-top:28px;">
                    <a href="{settings.FRONTEND_URL}/reports" style="display:inline-block;padding:12px 32px;background:#1a8fe8;color:white;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">View Your Report →</a>
                </div>
            </div>
            <div style="padding:20px 32px;background:#f7fafd;text-align:center;border-top:1px solid #e8f4fd;">
                <p style="margin:0;font-size:12px;color:#aaa;">CivicTide by TechTide Stratum · Ghana Communication Technology University</p>
            </div>
        </div>
    </body>
    </html>"""

    send_email(to, f"Your Report Status Updated — {label}", html)


def send_new_report_email(admin_email: str, report_title: str, category: str, reporter_name: str):
    html = f"""<!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f7fafd;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(10,58,102,0.08);">
            <div style="background:linear-gradient(135deg,#0a3a66,#1a8fe8);padding:32px;text-align:center;">
                <h1 style="margin:0;color:white;font-size:28px;font-weight:800;">CivicTide 🌊</h1>
            </div>
            <div style="padding:32px;">
                <h2 style="color:#0a3a66;margin:0 0 16px;">New Report Submitted 🚨</h2>
                <p style="color:#555;font-size:15px;">A new community issue has been reported and needs your attention.</p>
                <div style="padding:16px;background:#f7fafd;border-radius:8px;margin:20px 0;">
                    <p style="margin:0 0 8px;font-size:13px;color:#888;">REPORT TITLE</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#0a3a66;">{report_title}</p>
                    <p style="margin:8px 0 0;font-size:13px;color:#888;">Category: <strong>{category.replace('_', ' ').title()}</strong></p>
                    <p style="margin:4px 0 0;font-size:13px;color:#888;">Reported by: <strong>{reporter_name}</strong></p>
                </div>
                <div style="text-align:center;margin-top:24px;">
                    <a href="{settings.FRONTEND_URL}/admin" style="display:inline-block;padding:12px 32px;background:#1a8fe8;color:white;text-decoration:none;border-radius:10px;font-weight:700;">Review on Admin Dashboard →</a>
                </div>
            </div>
        </div>
    </body>
    </html>"""
    send_email(admin_email, f"New Report: {report_title}", html)
#!/usr/bin/env python3
"""
Upload LalaStoryLab.apk to Google Drive using Google Drive API v3.
Requires:
  pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
Usage:
  python3 scripts/upload_to_gdrive.py --apk artifacts/LalaStoryLab.apk --folder-id <FOLDER_ID> --credentials service_account.json
"""

import os
import sys
import argparse
import json

def upload_file(apk_path, folder_id, credentials_json_or_path):
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
    except ImportError:
        print("Please install google-api-python-client:")
        print("pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")
        sys.exit(1)

    if not os.path.exists(apk_path):
        print(f"Error: APK file not found at {apk_path}")
        sys.exit(1)

    # Determine if credentials is a file path or a JSON string
    if os.path.isfile(credentials_json_or_path):
        creds = service_account.Credentials.from_service_account_file(
            credentials_json_or_path,
            scopes=['https://www.googleapis.com/auth/drive.file']
        )
    else:
        try:
            info = json.loads(credentials_json_or_path)
            creds = service_account.Credentials.from_service_account_info(
                info,
                scopes=['https://www.googleapis.com/auth/drive.file']
            )
        except Exception as e:
            print(f"Failed to parse credentials: {e}")
            sys.exit(1)

    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': os.path.basename(apk_path),
        'parents': [folder_id] if folder_id else []
    }
    media = MediaFileUpload(apk_path, mimetype='application/vnd.android.package-archive', resumable=True)

    print(f"Uploading {apk_path} to Google Drive...")
    file = service.files().create(body=file_metadata, media_body=media, fields='id, name, webViewLink').execute()

    print(f"Upload successful!")
    print(f"File ID: {file.get('id')}")
    print(f"View Link: {file.get('webViewLink')}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Upload APK to Google Drive")
    parser.add_argument("--apk", default="artifacts/LalaStoryLab.apk", help="Path to APK file")
    parser.add_argument("--folder-id", default=os.environ.get("GDRIVE_FOLDER_ID", ""), help="Google Drive Folder ID")
    parser.add_argument("--credentials", default=os.environ.get("GDRIVE_CREDENTIALS", "service_account.json"), help="Service account credentials JSON path or raw string")

    args = parser.parse_args()
    upload_file(args.apk, args.folder_id, args.credentials)

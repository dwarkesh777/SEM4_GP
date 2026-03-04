import json
import os
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def get_colleges(request):
    try:
        json_path = os.path.join(settings.BASE_DIR, 'api', 'colleges.json')
        with open(json_path, 'r', encoding='utf-8') as f:
            colleges = json.load(f)
        return Response(colleges)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

from django.test import SimpleTestCase, override_settings
from rest_framework.test import APIRequestFactory

from .views import validate_external_api_key, developer_api_info


class ExternalApiKeyTests(SimpleTestCase):
    @override_settings(DEVELOPER_API_KEY='demo-key')
    def test_accepts_matching_api_key(self):
        request = type('RequestStub', (), {
            'headers': {'X-API-Key': 'demo-key'},
            'query_params': {},
        })()

        self.assertTrue(validate_external_api_key(request))

    @override_settings(DEVELOPER_API_KEY='demo-key')
    def test_rejects_missing_or_wrong_api_key(self):
        request = type('RequestStub', (), {
            'headers': {},
            'query_params': {'api_key': 'wrong-key'},
        })()

        self.assertFalse(validate_external_api_key(request))

    @override_settings(DEVELOPER_API_KEY='demo-key', DEVELOPER_READONLY_API_KEY='read-only-key')
    def test_accepts_openweather_style_appid_query_param(self):
        request = type('RequestStub', (), {
            'headers': {},
            'query_params': {'appid': 'demo-key'},
        })()

        self.assertTrue(validate_external_api_key(request))

    @override_settings(DEVELOPER_READONLY_API_KEY='read-only-key')
    def test_accepts_readonly_api_key(self):
        request = type('RequestStub', (), {
            'headers': {'X-API-Key': 'read-only-key'},
            'query_params': {},
        })()

        self.assertTrue(validate_external_api_key(request, mode='read'))

    @override_settings(DEVELOPER_BOOKING_API_KEY='booking-key')
    def test_accepts_booking_api_key(self):
        request = type('RequestStub', (), {
            'headers': {'X-API-Key': 'booking-key'},
            'query_params': {},
        })()

        self.assertTrue(validate_external_api_key(request, mode='booking'))

    @override_settings(DEVELOPER_API_KEY='demo-key')
    def test_developer_info_lists_hostel_and_booking_detail_endpoints(self):
        request = APIRequestFactory().get('/api/developer/info/')
        response = developer_api_info(request)

        self.assertEqual(response.status_code, 200)
        self.assertIn('/api/public/properties/detail/<id>/', response.data['endpoints']['hostel_detail'])
        self.assertIn('/api/public/bookings/detail/<id>/', response.data['endpoints']['booking_detail'])

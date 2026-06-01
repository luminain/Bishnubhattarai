"""
Backend API Testing for Bishnu Bhattarai Private Chauffeur
Tests all endpoints using the public URL
"""
import requests
import sys
from datetime import datetime, timedelta

class ChauffeurAPITester:
    def __init__(self, base_url="https://vip-transport-21.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, name, success, message="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED")
            if message:
                print(f"   {message}")
        else:
            print(f"❌ {name}: FAILED")
            print(f"   {message}")
        
        self.test_results.append({
            "test": name,
            "passed": success,
            "message": message,
            "data": response_data
        })

    def test_health(self):
        """Test GET /api/health"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            self.log_result(
                "GET /api/health",
                success,
                f"Status: {response.status_code}, Response: {data}",
                data
            )
            return success
        except Exception as e:
            self.log_result("GET /api/health", False, f"Error: {str(e)}")
            return False

    def test_locations(self):
        """Test GET /api/locations"""
        try:
            response = requests.get(f"{self.base_url}/locations", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                has_chips = "chips" in data and len(data["chips"]) > 0
                has_zones = "zones" in data and len(data["zones"]) > 0
                success = has_chips and has_zones
                self.log_result(
                    "GET /api/locations",
                    success,
                    f"Chips: {len(data.get('chips', []))}, Zones: {len(data.get('zones', []))}",
                    data
                )
            else:
                self.log_result("GET /api/locations", False, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_result("GET /api/locations", False, f"Error: {str(e)}")
            return False

    def test_quote_airport(self):
        """Test POST /api/quote - Airport service"""
        try:
            payload = {
                "service_type": "airport",
                "pickup": {"address": "SFO Airport"},
                "dropoff": {"address": "Downtown San Francisco"},
                "pickup_time": (datetime.now() + timedelta(days=1)).isoformat()
            }
            response = requests.post(f"{self.base_url}/quote", json=payload, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                has_total = "total" in data and data["total"] > 0
                has_breakdown = "breakdown" in data and len(data["breakdown"]) > 0
                has_gratuity = "gratuity" in data and data["gratuity"] > 0
                has_distance = "distance_miles" in data and data["distance_miles"] > 0
                success = has_total and has_breakdown and has_gratuity and has_distance
                self.log_result(
                    "POST /api/quote (airport SFO->SF)",
                    success,
                    f"Total: ${data.get('total', 0)}, Distance: {data.get('distance_miles', 0)} mi, Gratuity: ${data.get('gratuity', 0)}",
                    data
                )
            else:
                self.log_result("POST /api/quote (airport)", False, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_result("POST /api/quote (airport)", False, f"Error: {str(e)}")
            return False

    def test_quote_winery(self):
        """Test POST /api/quote - Winery service (minimum $850, 6h)"""
        try:
            payload = {
                "service_type": "winery",
                "pickup": {"address": "Downtown San Francisco"},
                "dropoff": {"address": "Napa Valley"},
                "pickup_time": (datetime.now() + timedelta(days=1)).isoformat(),
                "hours": 6
            }
            response = requests.post(f"{self.base_url}/quote", json=payload, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                total = data.get("total", 0)
                # Winery minimum is $850, with gratuity should be >= $850
                success = total >= 850
                self.log_result(
                    "POST /api/quote (winery SF->Napa)",
                    success,
                    f"Total: ${total} (minimum $850 enforced), 6h day trip",
                    data
                )
            else:
                self.log_result("POST /api/quote (winery)", False, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_result("POST /api/quote (winery)", False, f"Error: {str(e)}")
            return False

    def test_quote_hourly(self):
        """Test POST /api/quote - Hourly service (3h minimum)"""
        try:
            # Test with 2 hours - should enforce 3h minimum
            payload = {
                "service_type": "hourly",
                "pickup": {"address": "Downtown San Francisco"},
                "pickup_time": (datetime.now() + timedelta(days=1)).isoformat(),
                "hours": 2
            }
            response = requests.post(f"{self.base_url}/quote", json=payload, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                # 3h minimum at $145/h = $435, with 20% gratuity = $522
                total = data.get("total", 0)
                # Should be at least 3h * $145 * 1.2 = $522
                success = total >= 500
                self.log_result(
                    "POST /api/quote (hourly 3h min)",
                    success,
                    f"Total: ${total} (3h minimum enforced)",
                    data
                )
            else:
                self.log_result("POST /api/quote (hourly)", False, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_result("POST /api/quote (hourly)", False, f"Error: {str(e)}")
            return False

    def test_quote_late_night(self):
        """Test POST /api/quote - Late-night surcharge (10pm-6am)"""
        try:
            # Create a late-night pickup time (11pm)
            tomorrow = datetime.now() + timedelta(days=1)
            late_night = tomorrow.replace(hour=23, minute=0, second=0, microsecond=0)
            
            payload = {
                "service_type": "airport",
                "pickup": {"address": "Downtown San Francisco"},
                "dropoff": {"address": "SFO Airport"},
                "pickup_time": late_night.isoformat()
            }
            response = requests.post(f"{self.base_url}/quote", json=payload, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                breakdown = data.get("breakdown", [])
                has_surcharge = any("late-night" in b.get("label", "").lower() for b in breakdown)
                self.log_result(
                    "POST /api/quote (late-night surcharge)",
                    has_surcharge,
                    f"Late-night surcharge {'found' if has_surcharge else 'NOT FOUND'} in breakdown",
                    data
                )
                return has_surcharge
            else:
                self.log_result("POST /api/quote (late-night)", False, f"Status: {response.status_code}")
            return False
        except Exception as e:
            self.log_result("POST /api/quote (late-night)", False, f"Error: {str(e)}")
            return False

    def test_create_booking(self):
        """Test POST /api/bookings - Create booking"""
        try:
            payload = {
                "service_type": "airport",
                "vehicle": "Cadillac Escalade",
                "pickup": {"address": "SFO Airport"},
                "dropoff": {"address": "Downtown San Francisco"},
                "pickup_time": (datetime.now() + timedelta(days=2)).isoformat(),
                "passengers": 2,
                "luggage": 2,
                "flight_number": "UA 123",
                "notes": "Test booking",
                "customer": {
                    "name": "Test User",
                    "email": "test@example.com",
                    "phone": "+14155551234"
                }
            }
            response = requests.post(f"{self.base_url}/bookings", json=payload, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                confirmation = data.get("confirmation", "")
                has_bb_code = confirmation.startswith("BB-") and len(confirmation) == 11
                success = has_bb_code
                self.log_result(
                    "POST /api/bookings (create)",
                    success,
                    f"Confirmation: {confirmation}",
                    {"confirmation": confirmation}
                )
                # Store confirmation for next test
                self.test_confirmation = confirmation
                return success
            else:
                self.log_result("POST /api/bookings", False, f"Status: {response.status_code}")
            return False
        except Exception as e:
            self.log_result("POST /api/bookings", False, f"Error: {str(e)}")
            return False

    def test_get_booking(self):
        """Test GET /api/bookings/{confirmation}"""
        if not hasattr(self, 'test_confirmation'):
            self.log_result("GET /api/bookings/{confirmation}", False, "No confirmation code from previous test")
            return False
        
        try:
            response = requests.get(f"{self.base_url}/bookings/{self.test_confirmation}", timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                has_confirmation = data.get("confirmation") == self.test_confirmation
                self.log_result(
                    "GET /api/bookings/{confirmation}",
                    has_confirmation,
                    f"Retrieved booking {self.test_confirmation}",
                    data
                )
                return has_confirmation
            else:
                self.log_result("GET /api/bookings/{confirmation}", False, f"Status: {response.status_code}")
            return False
        except Exception as e:
            self.log_result("GET /api/bookings/{confirmation}", False, f"Error: {str(e)}")
            return False

    def test_admin_login_success(self):
        """Test POST /api/admin/login - Valid credentials"""
        try:
            payload = {
                "email": "bishnu@bbchauffeur.com",
                "password": "BayArea2025!"
            }
            response = requests.post(f"{self.base_url}/admin/login", json=payload, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                has_token = "access_token" in data and len(data["access_token"]) > 0
                success = has_token
                if has_token:
                    self.token = data["access_token"]
                self.log_result(
                    "POST /api/admin/login (valid)",
                    success,
                    f"Token received: {data.get('access_token', '')[:20]}...",
                    {"has_token": has_token}
                )
            else:
                self.log_result("POST /api/admin/login (valid)", False, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_result("POST /api/admin/login (valid)", False, f"Error: {str(e)}")
            return False

    def test_admin_login_fail(self):
        """Test POST /api/admin/login - Invalid credentials"""
        try:
            payload = {
                "email": "bishnu@bbchauffeur.com",
                "password": "WrongPassword123"
            }
            response = requests.post(f"{self.base_url}/admin/login", json=payload, timeout=10)
            success = response.status_code == 401
            self.log_result(
                "POST /api/admin/login (invalid)",
                success,
                f"Status: {response.status_code} (expected 401)",
                {}
            )
            return success
        except Exception as e:
            self.log_result("POST /api/admin/login (invalid)", False, f"Error: {str(e)}")
            return False

    def test_admin_bookings_no_token(self):
        """Test GET /api/admin/bookings - Without token (should fail)"""
        try:
            response = requests.get(f"{self.base_url}/admin/bookings", timeout=10)
            success = response.status_code == 401
            self.log_result(
                "GET /api/admin/bookings (no token)",
                success,
                f"Status: {response.status_code} (expected 401)",
                {}
            )
            return success
        except Exception as e:
            self.log_result("GET /api/admin/bookings (no token)", False, f"Error: {str(e)}")
            return False

    def test_admin_bookings_with_token(self):
        """Test GET /api/admin/bookings - With valid token"""
        if not self.token:
            self.log_result("GET /api/admin/bookings (with token)", False, "No token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/admin/bookings", headers=headers, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                has_items = "items" in data
                self.log_result(
                    "GET /api/admin/bookings (with token)",
                    has_items,
                    f"Retrieved {len(data.get('items', []))} bookings",
                    {"count": len(data.get('items', []))}
                )
                return has_items
            else:
                self.log_result("GET /api/admin/bookings (with token)", False, f"Status: {response.status_code}")
            return False
        except Exception as e:
            self.log_result("GET /api/admin/bookings (with token)", False, f"Error: {str(e)}")
            return False

    def test_admin_update_status_valid(self):
        """Test PATCH /api/admin/bookings/{confirmation}/status - Valid status"""
        if not self.token or not hasattr(self, 'test_confirmation'):
            self.log_result("PATCH /api/admin/bookings/{confirmation}/status (valid)", False, "No token or confirmation")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            payload = {"status": "confirmed"}
            response = requests.patch(
                f"{self.base_url}/admin/bookings/{self.test_confirmation}/status",
                json=payload,
                headers=headers,
                timeout=10
            )
            success = response.status_code == 200
            if success:
                data = response.json()
                updated = data.get("booking", {}).get("status") == "confirmed"
                self.log_result(
                    "PATCH /api/admin/bookings/{confirmation}/status (valid)",
                    updated,
                    f"Status updated to 'confirmed'",
                    data
                )
                return updated
            else:
                self.log_result("PATCH status (valid)", False, f"Status: {response.status_code}")
            return False
        except Exception as e:
            self.log_result("PATCH status (valid)", False, f"Error: {str(e)}")
            return False

    def test_admin_update_status_invalid(self):
        """Test PATCH /api/admin/bookings/{confirmation}/status - Invalid status"""
        if not self.token or not hasattr(self, 'test_confirmation'):
            self.log_result("PATCH /api/admin/bookings/{confirmation}/status (invalid)", False, "No token or confirmation")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            payload = {"status": "invalid_status"}
            response = requests.patch(
                f"{self.base_url}/admin/bookings/{self.test_confirmation}/status",
                json=payload,
                headers=headers,
                timeout=10
            )
            success = response.status_code == 400
            self.log_result(
                "PATCH /api/admin/bookings/{confirmation}/status (invalid)",
                success,
                f"Status: {response.status_code} (expected 400)",
                {}
            )
            return success
        except Exception as e:
            self.log_result("PATCH status (invalid)", False, f"Error: {str(e)}")
            return False

    def test_admin_stats(self):
        """Test GET /api/admin/stats"""
        if not self.token:
            self.log_result("GET /api/admin/stats", False, "No token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/admin/stats", headers=headers, timeout=10)
            success = response.status_code == 200
            if success:
                data = response.json()
                has_fields = all(k in data for k in ["total_bookings", "revenue", "avg_fare", "upcoming", "by_status", "revenue_series"])
                self.log_result(
                    "GET /api/admin/stats",
                    has_fields,
                    f"Total: {data.get('total_bookings')}, Revenue: ${data.get('revenue')}, Avg: ${data.get('avg_fare')}, Upcoming: {data.get('upcoming')}",
                    data
                )
                return has_fields
            else:
                self.log_result("GET /api/admin/stats", False, f"Status: {response.status_code}")
            return False
        except Exception as e:
            self.log_result("GET /api/admin/stats", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests"""
        print("\n" + "="*70)
        print("BACKEND API TESTING - Bishnu Bhattarai Private Chauffeur")
        print("="*70 + "\n")
        
        # Public endpoints
        print("--- PUBLIC ENDPOINTS ---")
        self.test_health()
        self.test_locations()
        self.test_quote_airport()
        self.test_quote_winery()
        self.test_quote_hourly()
        self.test_quote_late_night()
        self.test_create_booking()
        self.test_get_booking()
        
        # Admin endpoints
        print("\n--- ADMIN ENDPOINTS ---")
        self.test_admin_login_success()
        self.test_admin_login_fail()
        self.test_admin_bookings_no_token()
        self.test_admin_bookings_with_token()
        self.test_admin_update_status_valid()
        self.test_admin_update_status_invalid()
        self.test_admin_stats()
        
        # Summary
        print("\n" + "="*70)
        print(f"RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*70 + "\n")
        
        return self.tests_passed == self.tests_run

def main():
    tester = ChauffeurAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())

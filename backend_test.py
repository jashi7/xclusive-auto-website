#!/usr/bin/env python3
"""
Backend API Test Suite for Xclusive Auto
Tests all 17 scenarios as specified in the review request
"""
import requests
import json
import sys

# Base URL from frontend/.env
BASE_URL = "https://sleek-garage-hub.preview.emergentagent.com/api"

# Test credentials
TEST_EMAIL = "vipanaquee7@gmail.com"
TEST_PASSWORD = "#Ipanaque030207"

# Global variables to store state
auth_token = None
created_vehicle_id = None
created_lead_ids = []

def print_test(num, description):
    """Print test header"""
    print(f"\n{'='*80}")
    print(f"TEST {num}: {description}")
    print('='*80)

def print_result(success, message, details=None):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")
    if details:
        print(f"Details: {json.dumps(details, indent=2)}")
    return success

def test_1_login_success():
    """Test 1: POST /api/auth/login with valid credentials"""
    global auth_token
    print_test(1, "Login with valid credentials")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": TEST_EMAIL, "password": TEST_PASSWORD},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and data.get("email") == TEST_EMAIL:
                auth_token = data["token"]
                return print_result(True, "Login successful, JWT token received", {"email": data["email"]})
            else:
                return print_result(False, "Response missing token or email", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_2_auth_me():
    """Test 2: GET /api/auth/me with Bearer token"""
    print_test(2, "Get current user with Bearer token")
    
    if not auth_token:
        return print_result(False, "No auth token available from test 1")
    
    try:
        response = requests.get(
            f"{BASE_URL}/auth/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("email") == TEST_EMAIL:
                return print_result(True, "Auth verification successful", data)
            else:
                return print_result(False, f"Expected email {TEST_EMAIL}, got {data.get('email')}", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_3_login_bad_password():
    """Test 3: POST /api/auth/login with bad password"""
    print_test(3, "Login with bad password (should return 401)")
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"email": TEST_EMAIL, "password": "wrongpassword"},
            timeout=10
        )
        
        if response.status_code == 401:
            return print_result(True, "Correctly rejected bad password with 401", response.json())
        else:
            return print_result(False, f"Expected 401, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_4_list_vehicles():
    """Test 4: GET /api/vehicles (no auth) - should return ~12 seeded vehicles"""
    print_test(4, "List all vehicles (no auth required)")
    
    try:
        response = requests.get(f"{BASE_URL}/vehicles", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) >= 12:
                return print_result(True, f"Retrieved {len(data)} vehicles", {"count": len(data), "first_vehicle": data[0] if data else None})
            else:
                return print_result(False, f"Expected list with ~12 vehicles, got {len(data) if isinstance(data, list) else 'not a list'}", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_5_get_vehicle_by_id():
    """Test 5: GET /api/vehicles/{id} using id from list"""
    print_test(5, "Get specific vehicle by ID")
    
    try:
        # First get the list
        response = requests.get(f"{BASE_URL}/vehicles", timeout=10)
        if response.status_code != 200:
            return print_result(False, "Could not fetch vehicle list")
        
        vehicles = response.json()
        if not vehicles or not isinstance(vehicles, list):
            return print_result(False, "No vehicles available to test")
        
        vehicle_id = vehicles[0].get("id")
        if not vehicle_id:
            return print_result(False, "Vehicle missing 'id' field", vehicles[0])
        
        # Now get specific vehicle
        response = requests.get(f"{BASE_URL}/vehicles/{vehicle_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("id") == vehicle_id:
                return print_result(True, f"Retrieved vehicle {vehicle_id}", {"make": data.get("make"), "model": data.get("model")})
            else:
                return print_result(False, "Vehicle ID mismatch", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_6_create_vehicle():
    """Test 6: POST /api/vehicles with Bearer token"""
    global created_vehicle_id
    print_test(6, "Create new vehicle (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    vehicle_data = {
        "year": 2020,
        "make": "Ford",
        "model": "F-150",
        "trim": "XLT",
        "body": "Pickup Truck",
        "mileage": 50000,
        "price": 25000,
        "color": "Blue",
        "fuel": "Gasoline",
        "transmission": "Automatic",
        "features": ["4WD"],
        "photos": ["data:image/png;base64,iVBORw0KGgo="],
        "description": "Test truck"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/vehicles",
            json=vehicle_data,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("make") == "Ford" and data.get("model") == "F-150":
                created_vehicle_id = data["id"]
                return print_result(True, f"Vehicle created with ID {created_vehicle_id}", {"id": created_vehicle_id, "make": data["make"], "model": data["model"]})
            else:
                return print_result(False, "Response missing expected fields", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_7_update_vehicle():
    """Test 7: PUT /api/vehicles/{id} with Bearer token"""
    print_test(7, "Update vehicle price (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    if not created_vehicle_id:
        return print_result(False, "No vehicle ID from test 6")
    
    update_data = {
        "year": 2020,
        "make": "Ford",
        "model": "F-150",
        "trim": "XLT",
        "body": "Pickup Truck",
        "mileage": 50000,
        "price": 24000,  # Updated price
        "color": "Blue",
        "fuel": "Gasoline",
        "transmission": "Automatic",
        "features": ["4WD"],
        "photos": ["data:image/png;base64,iVBORw0KGgo="],
        "description": "Test truck"
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/vehicles/{created_vehicle_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("price") == 24000:
                return print_result(True, f"Vehicle price updated to 24000", {"id": data.get("id"), "price": data.get("price")})
            else:
                return print_result(False, f"Expected price 24000, got {data.get('price')}", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_8_delete_vehicle():
    """Test 8: DELETE /api/vehicles/{id} with Bearer token, then verify 404"""
    print_test(8, "Delete vehicle and verify 404 (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    if not created_vehicle_id:
        return print_result(False, "No vehicle ID from test 6")
    
    try:
        # Delete the vehicle
        response = requests.delete(
            f"{BASE_URL}/vehicles/{created_vehicle_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code != 200:
            return print_result(False, f"Delete failed with status {response.status_code}", response.text)
        
        # Verify it returns 404
        response = requests.get(f"{BASE_URL}/vehicles/{created_vehicle_id}", timeout=10)
        
        if response.status_code == 404:
            return print_result(True, "Vehicle deleted and GET returns 404")
        else:
            return print_result(False, f"Expected 404 after delete, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_9_create_vehicle_no_auth():
    """Test 9: POST /api/vehicles WITHOUT auth token (should return 401)"""
    print_test(9, "Create vehicle without auth (should return 401)")
    
    vehicle_data = {
        "year": 2020,
        "make": "Test",
        "model": "NoAuth",
        "price": 10000
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/vehicles",
            json=vehicle_data,
            timeout=10
        )
        
        if response.status_code == 401:
            return print_result(True, "Correctly rejected request without auth with 401")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_10_create_contact_lead():
    """Test 10: POST /api/leads (no auth) - contact lead"""
    global created_lead_ids
    print_test(10, "Create contact lead (no auth required)")
    
    lead_data = {
        "kind": "contact",
        "name": "Test User",
        "email": "test@test.com",
        "phone": "5551234567",
        "message": "Test message"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/leads",
            json=lead_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("kind") == "contact":
                created_lead_ids.append(data["id"])
                return print_result(True, f"Contact lead created with ID {data['id']}", {"id": data["id"], "kind": data["kind"], "name": data.get("name")})
            else:
                return print_result(False, "Response missing expected fields", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_11_create_financing_lead():
    """Test 11: POST /api/leads (no auth) - financing lead"""
    global created_lead_ids
    print_test(11, "Create financing lead (no auth required)")
    
    lead_data = {
        "kind": "financing",
        "first_name": "Ana",
        "last_name": "Test",
        "email": "ana@test.com",
        "phone": "5555551234",
        "income": "3000",
        "employment": "Full-time",
        "down_payment": "1000",
        "comment": "test"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/leads",
            json=lead_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("kind") == "financing":
                created_lead_ids.append(data["id"])
                return print_result(True, f"Financing lead created with ID {data['id']}", {"id": data["id"], "kind": data["kind"], "first_name": data.get("first_name")})
            else:
                return print_result(False, "Response missing expected fields", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_12_list_leads_with_auth():
    """Test 12: GET /api/leads with Bearer token (should return the 2 leads)"""
    print_test(12, "List leads (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    try:
        response = requests.get(
            f"{BASE_URL}/leads",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) >= 2:
                return print_result(True, f"Retrieved {len(data)} leads", {"count": len(data), "lead_ids": [l.get("id") for l in data[:2]]})
            else:
                return print_result(False, f"Expected at least 2 leads, got {len(data) if isinstance(data, list) else 'not a list'}", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_13_list_leads_no_auth():
    """Test 13: GET /api/leads WITHOUT auth (should return 401)"""
    print_test(13, "List leads without auth (should return 401)")
    
    try:
        response = requests.get(f"{BASE_URL}/leads", timeout=10)
        
        if response.status_code == 401:
            return print_result(True, "Correctly rejected request without auth with 401")
        else:
            return print_result(False, f"Expected 401, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_14_mark_lead_read():
    """Test 14: PATCH /api/leads/{id}/read with Bearer token"""
    print_test(14, "Mark lead as read (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    if not created_lead_ids:
        return print_result(False, "No lead IDs from tests 10-11")
    
    lead_id = created_lead_ids[0]
    
    try:
        response = requests.patch(
            f"{BASE_URL}/leads/{lead_id}/read",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return print_result(True, f"Lead {lead_id} marked as read", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_15_get_settings():
    """Test 15: GET /api/settings with Bearer token"""
    print_test(15, "Get settings (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    try:
        response = requests.get(
            f"{BASE_URL}/settings",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "notification_email" in data:
                return print_result(True, "Settings retrieved with notification_email", {"notification_email": data["notification_email"]})
            else:
                return print_result(False, "Response missing notification_email", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_16_update_settings():
    """Test 16: PUT /api/settings with Bearer token"""
    print_test(16, "Update settings (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    settings_data = {
        "notification_email": "newemail@test.com"
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/settings",
            json=settings_data,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("notification_email") == "newemail@test.com":
                return print_result(True, "Settings updated successfully", {"notification_email": data["notification_email"]})
            else:
                return print_result(False, f"Expected notification_email 'newemail@test.com', got {data.get('notification_email')}", data)
        else:
            return print_result(False, f"Expected 200, got {response.status_code}", response.text)
    except Exception as e:
        return print_result(False, f"Exception occurred: {str(e)}")

def test_17_cleanup_leads():
    """Test 17: Clean up - delete the created leads"""
    print_test(17, "Clean up created leads (with auth)")
    
    if not auth_token:
        return print_result(False, "No auth token available")
    
    if not created_lead_ids:
        return print_result(True, "No leads to clean up")
    
    success_count = 0
    for lead_id in created_lead_ids:
        try:
            response = requests.delete(
                f"{BASE_URL}/leads/{lead_id}",
                headers={"Authorization": f"Bearer {auth_token}"},
                timeout=10
            )
            if response.status_code == 200:
                success_count += 1
        except Exception as e:
            print(f"Failed to delete lead {lead_id}: {str(e)}")
    
    if success_count == len(created_lead_ids):
        return print_result(True, f"Successfully deleted {success_count} leads")
    else:
        return print_result(False, f"Only deleted {success_count}/{len(created_lead_ids)} leads")

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("XCLUSIVE AUTO BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Email: {TEST_EMAIL}")
    print("="*80)
    
    tests = [
        test_1_login_success,
        test_2_auth_me,
        test_3_login_bad_password,
        test_4_list_vehicles,
        test_5_get_vehicle_by_id,
        test_6_create_vehicle,
        test_7_update_vehicle,
        test_8_delete_vehicle,
        test_9_create_vehicle_no_auth,
        test_10_create_contact_lead,
        test_11_create_financing_lead,
        test_12_list_leads_with_auth,
        test_13_list_leads_no_auth,
        test_14_mark_lead_read,
        test_15_get_settings,
        test_16_update_settings,
        test_17_cleanup_leads,
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"❌ FAIL: Test crashed with exception: {str(e)}")
            results.append(False)
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} TEST(S) FAILED")
        return 1

if __name__ == "__main__":
    sys.exit(main())

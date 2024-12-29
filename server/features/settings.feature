Feature: Settings

  Scenario: Can fetch users settings
    Given Some settings are persisted
    When /settings is requested
    Then I should get a 200 response
    And the response should be [{"id": 1, "agents": [{"ip": "192.168.1.100", "sudo_password": "password"}]}]

  Scenario: Can persist settings
    Given Some settings are persisted
    When /persist/settings is requested with json-file "settings_basic.json"
    Then I should get a 200 response
    And the response should be OK

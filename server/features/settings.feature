Feature: Settings

  Scenario: Can fetch users settings
    Given Some settings are persisted
    When /settings is requested
    Then I should get a 200 response
    And the response should be {"agents":[{"id":0,"ip":"192.168","main":1,"nickname":"nickname","os":"os","shell":"shell","sudo_password":"password","username":"username"}],"id":1}

  Scenario: Can persist settings
    Given Some settings are persisted
    When /persist/settings is requested with json-file "settings_basic.json"
    Then I should get a 200 response
    And the response should be OK

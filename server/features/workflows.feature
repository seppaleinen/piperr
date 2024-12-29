Feature: Workflows

  Scenario: Can fetch a list of workflows
    Given Some workflows are persisted
    When /workflows is requested
    Then I should get a 200 response
    And the response should be [{"cards":[{"card_index":0,"script":"echo hej"}],"title":"title"}]

  Scenario Outline: Persisting Workflows
    Given no data in workflows table
    When /persist/workflows is requested with json-file "<json-file>"
    Then I should get a 200 response
    And the response should be OK
    And database should contain workflow with title "<expected_title>"
    And database should contain workflow with script "<expected_script>"
    Examples:
      | json-file                    | expected_title | expected_script |
      | workflow_barebones.json      | title            | script             |
      | workflow_basic.json          | title            | script             |
      | workflow_multiple_cards.json | title            | script2            |
      | workflow_multiple.json       | title2           | script            |

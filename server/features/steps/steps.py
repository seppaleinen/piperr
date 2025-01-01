import json
import sqlite3

from behave import given, when, then
from hamcrest import assert_that, equal_to, not_none
from main import app, get_db
from os.path import dirname, join as joinpath


@given(u'Some workflows are persisted')
def given_workflows_persisted(context):
    with app.app_context():
        c = get_db()
        c.execute('INSERT OR REPLACE INTO settings (id) VALUES (?)', (0,))
        c.execute('INSERT OR REPLACE INTO agents '
                  '(id, settings_id, sudo_password, main, nickname, ip, os, shell, username) VALUES '
                  '(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  (0, 0, 'password', 1, 'nickname', '192.168', 'os', 'shell', 'username'))
        c.execute('INSERT OR REPLACE INTO workflows (title, agent_id) VALUES (?, ?)', ("title", 0))
        c.execute('INSERT OR REPLACE INTO cards (workflow_title, card_index, script) VALUES (?, ?, ?)',
                  ('title', 0, 'echo hej'))
        c.commit()


@when(u'{path} is requested')
def url_is_called_with_get(context, path):
    context.response = context.client.get(path)

@when(u'{path} is requested with json')
def url_is_called_with_post(context, path):
    context.response = context.client.post(path, json=json.loads(context.text))

@then(u'I should get a {http_status} response')
def expect_http_status(context, http_status):
    assert_that(context.response.status_code, equal_to(int(http_status)))

@then(u'the response should be {expected_response}')
def expect_response(context, expected_response):
    try:
        expected_response2 = json.loads(expected_response)
        actual_response = json.loads(context.response.text.strip())
        assert_that(actual_response, equal_to(expected_response2))
    except json.JSONDecodeError:
        expected_response = expected_response
        actual_response = context.response.text.strip()
        assert_that(actual_response, equal_to(expected_response))

@given("no data in workflows table")
def delete_workflows_and_cards(context):
    with app.app_context():
        conn = get_db()
        conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
        c = conn.cursor()
        c.execute('DELETE FROM workflows')
        c.execute('DELETE FROM cards')
        conn.commit()

@then('database should contain workflow with title "{expected_title}"')
def expect_title_to_be_in_db(context, expected_title):
    with app.app_context():
        conn = get_db()
        conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
        c = conn.cursor()
        c.execute('select title from workflows where title = ?', (expected_title,))
        row = c.fetchone()
        assert_that(row, not_none())


@then('database should contain workflow with script "{expected_script}"')
def expect_script_to_be_in_db(context, expected_script):
    with app.app_context():
        conn = get_db()
        conn.row_factory = sqlite3.Row  # Helps fetch rows as dictionaries
        c = conn.cursor()
        c.execute('select script from cards where script = ?', (expected_script,))
        row = c.fetchone()
        assert_that(row, not_none())


@when('{path} is requested with json-file "{json_file}"')
def post_with_data_from_file(context, path, json_file):
    file_path = joinpath(dirname(__file__), '..', 'testdata', json_file)
    with open(file_path, 'r') as file:
        data = file.read()
        context.response = context.client.post(path, json=json.loads(data))


@given("Some settings are persisted")
def settings_are_persisted(context):
    with app.app_context():
        c = get_db()
        c.execute('INSERT OR REPLACE INTO settings (id) VALUES (?)', (1,))
        c.execute('INSERT OR REPLACE INTO agents '
                  '(id, settings_id, sudo_password, main, nickname, ip, os, shell, username) VALUES '
                  '(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  (0, 1, 'password', 1, 'nickname', '192.168', 'os', 'shell', 'username'))
        c.commit()

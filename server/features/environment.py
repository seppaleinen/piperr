from behave import fixture, use_fixture
# flaskr is the sample application we want to test
from main import app


@fixture
def flaskr_client(context, *args, **kwargs):
    #context.db, app.config['DATABASE'] = tempfile.mkstemp()
    app.testing = True
    context.client = app.test_client()
    context.app = app
    with app.app_context():
        yield context.client
    # -- CLEANUP:
    #os.close(context.db)
    #os.unlink(app.config['DATABASE'])

def before_feature(context, feature):
    use_fixture(flaskr_client, context)

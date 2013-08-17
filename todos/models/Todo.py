class Todo(object):
	" Todo model "

	def get_all_for_user(self,userId):
		return []

	def __init__(self, userId, title):
        self.userId = userId
        self.title = title
        self.status = 0
    
var App = React.createClass({
	getInitialState: function() {
		return {
			text: '',
			journals: []
		};
	},

	componentWillMount: function(){
		this.firebaseRef = new Firebase('https://dgm-journalapp.firebaseio.com/journals');
		var that = this;
		this.firebaseRef.once("value", function(snapshot){
			var journals = [];
			snapshot.forEach(function(data){
				var journal = {
					id: data.val().id,
					title: data.val().title,
					content: data.val().content
				}
				journals.push(journal);
				that.setState({journals: journals});
			});
		});
	},

	render: function() {
		return (
			<div className="container">
				<h1 className="page-header text-center">Journal</h1>
				<JournalForm onTodoAdd={this.handleJournalAdd} />
				<JournalList journals={this.state.journals} />
			</div>
		);
	},

	handleJournalAdd: function(title, content){
		var newJournal = {
			id: this.state.journals.length + 1,
			title: title,
			content: content
		}
		console.log(newJournal);

		this.firebaseRef.push(newJournal);

		this.setState({journals: this.state.journals.concat(newJournal)});
	}
});

var JournalForm = React.createClass({
	render: function() {
		return (
			<div>
				<form onSubmit={this.onSubmit} >
					<div className="form-group">
						<input className="form-control" type="text" ref="title" placeholder='title here'/>
						<textarea className="form-control" ref="text" rows="5" cols="150" placeholder="content" onChange={this.onChange}></textarea>
						<button className="btn btn-primary">Submit</button>
					</div>
				</form>
			</div>
		);
	},
	onChange: function() {
		console.log('changing text...');
	},
	onSubmit: function(e) {
		e.preventDefault();
		var title = this.refs.title.value.trim();
		var content = this.refs.text.value.trim();

		if(!content || !title){
			alert('Enter both Title and Content');
			return;
		}
		this.props.onTodoAdd(title, content);
		this.refs.text.value = '';
		this.refs.title.value = '';
	}
});

var JournalList = React.createClass({
	render: function() {
		return (
			<div>
				{
					this.props.journals.map(todo => {
						return <PanelView key={todo.id} title={todo.title} content={todo.content} />
					})
				}
			</div>
		);
	}
});

var PanelView = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<div className="panel-title">
						{this.props.title}
					</div>
				</div>
				{this.props.id}
				<div className="panel-body">
					{this.props.content}
				</div>
			</div>
		);
	}
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
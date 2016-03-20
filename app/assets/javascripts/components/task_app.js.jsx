var TaskApp = React.createClass({
  handleTaskSubmit: function(task) {
    this.setState({data: this.state.data.concat([task])});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: task,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadTaskFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  taskDestroy: function(id) {
    $.ajax({
      url: this.props.url + '/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: id,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  taskUpdate: function(task) {
    $.ajax({
      url: this.props.url + '/' + task.task.id,
      dataType: 'json',
      type: 'PATCH',
      data: task,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadTaskFromServer();
    setInterval(this.loadTaskFromServer, this.props.pollInterval);
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return (
      <div className="taskApp">
        <h1>Listing Tasks</h1>
        <TaskForm onTaskSubmit={this.handleTaskSubmit} />
        <table>
          <thead>
            <tr>
              <th>Content</th>
              <th>Status</th>
              <th colSpan="3"></th>
           </tr>
          </thead>
          <TaskList data={this.state.data} onTaskDestroy={this.taskDestroy} onTaskUpdate={this.taskUpdate} />
        </table>
      </div>
    );
  }
});

var TaskForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var content = ReactDOM.findDOMNode(this.refs.content).value.trim();
    if (!content) {
      return;
    }
    this.props.onTaskSubmit({task: {content: content, status: 'todo'}});
    ReactDOM.findDOMNode(this.refs.content).value = '';
    return;
  },
  render: function() {
    return (
      <form className="todoForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="ToDo" ref="content"/>
        <input type="submit" value="登録" />
      </form>
    );
  }
});

var TaskList = React.createClass({
  render: function() {
    var tasks = this.props.data.map(function (task) {
      return (
        <Task key={task.id} id={task.id} content={task.content} status={task.status} onTaskDestroy={this.props.onTaskDestroy} onTaskUpdate={this.props.onTaskUpdate} >
        </Task>
      );
    }.bind(this));
    return (
      <tbody>
        {tasks}
      </tbody>
    );
  }
});

var Task = React.createClass({
  handleDestroy: function(e) {
    e.preventDefault();
    this.props.onTaskDestroy(this.props.id);
  },
  handleUpdate: function(e) {
    e.preventDefault();
    this.props.onTaskUpdate({task: {id: this.props.id, status: e.target.value}});
  },
  render: function() {
    return (
      <tr key={this.props.key}>
        <td>
          {this.props.content}
        </td>
        <td>
          <select defaultValue={this.props.status} onChange={this.handleUpdate} >
            <option value="todo" key="todo">todo</option>
            <option value="doing" key="doing">doing</option>
            <option value="done" key="done">done</option>
          </select>
        </td>
        <td>
          <button onClick={this.handleDestroy}>destroy</button>
        </td>
      </tr>
    );
  }
});

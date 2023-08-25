import { useEffect, useState } from 'react';
import { Divider, Select, List, Button } from 'antd';
import { MinusSquareOutlined, CheckCircleOutlined } from '@ant-design/icons/';
import './home.css';

const onMakeDone = async (task) => {
  const resp = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${task.id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        completed: true,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }
  );

  return resp.json();
};

const Task = ({ task, onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    await onClick();

    setLoading(false);
  };

  return (
    <div className='w-full'>
      {task.completed === true ? (
        <CheckCircleOutlined className='completed-icon' />
      ) : (
        <MinusSquareOutlined className='undone-icon' />
      )}
      {task.title}
      {task.completed === true ? (
        ''
      ) : (
        <Button
          size='small'
          className='markDoneBtn'
          loading={loading}
          onClick={handleClick}
        >
          Mark done
        </Button>
      )}
    </div>
  );
};

const Home = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState(null);

  //User
  useEffect(() => {
    const getUsers = async () => {
      const resp = await fetch('https://jsonplaceholder.typicode.com/users');
      const json = await resp.json();
      setUsers(
        json.map((user) => ({
          label: user.name,
          value: user.id,
        }))
      );
    };

    getUsers();
  }, []);

  //Tasks
  useEffect(() => {
    const getTasks = async () => {
      const resp = await fetch(
        `https://jsonplaceholder.typicode.com/users/${taskId}/todos`
      );
      const json = await resp.json();
      setTasks(
        json.map((task) => ({
          userId: taskId,
          id: task.id,
          title: task.title,
          completed: task.completed,
        }))
      );
    };
    getTasks();
  }, [taskId]);

  const onChange = (value) => {
    setTaskId(value);
  };

  const completedTasks = tasks.filter((task) => task.completed === true).length;

  const makeDone = async (index, task) => {
    const resp = await onMakeDone(task);

    if (!resp) return;

    setTasks((prevState) => [
      ...prevState,
      (prevState[index].completed = resp.completed),
    ]);
  };

  const filteredTasks = tasks.sort((a, b) => a.completed - b.completed);

  return (
    <div className='container'>
      <section>
        <Divider orientation='left' orientationMargin='0'>
          User
        </Divider>

        <Select
          showSearch
          optionFilterProp='children'
          onChange={onChange}
          style={{
            width: 200,
          }}
          placeholder='Select user'
          filterOption={(input, option) =>
            (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={users}
        />
      </section>

      <section>
        <Divider orientation='left' orientationMargin='0'>
          Tasks
        </Divider>

        <List
          size='large'
          className='tasksList'
          bordered
          dataSource={filteredTasks}
          renderItem={(task, index) => {
            return (
              <List.Item>
                <Task
                  task={task}
                  onClick={async () => await makeDone(index, task)}
                />
              </List.Item>
            );
          }}
        />
        <div className='mt-3'>
          Done {completedTasks}/{tasks.length} Task
        </div>
      </section>
    </div>
  );
};

export default Home;

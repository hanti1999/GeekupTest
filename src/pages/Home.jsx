import { useEffect, useState } from 'react';
import { Divider, Select, List, Button } from 'antd';
import { MinusSquareOutlined, CheckCircleOutlined } from '@ant-design/icons/';
import './home.css';

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
          className='float-right'
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
  let [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  //User
  useEffect(() => {
    const getUsers = async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const json = await res.json();
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
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}/todos`
      );
      const json = await res.json();
      setTasks(
        json.map((task) => ({
          userId: userId,
          id: task.id,
          title: task.title,
          completed: task.completed,
        }))
      );
    };
    getTasks();
  }, [userId]);

  const completedTasks = tasks.filter((task) => task.completed === true).length;

  const makeDone = async (task) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${task.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          completed: true,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      }
    );

    setTasks(
      tasks.map((item) => {
        if (item.id === task.id) {
          return { ...item, completed: true };
        } else {
          return item;
        }
      })
    );
  };

  tasks.sort((a, b) => a.completed - b.completed);

  return (
    <div className='container'>
      <section>
        <Divider orientation='left' orientationMargin='0'>
          User
        </Divider>

        <Select
          showSearch
          optionFilterProp='children'
          onChange={(e) => setUserId(e)}
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
          className='h-[500px] overflow-auto'
          bordered
          dataSource={tasks}
          renderItem={(task) => {
            return (
              <List.Item>
                <Task task={task} onClick={async () => await makeDone(task)} />
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

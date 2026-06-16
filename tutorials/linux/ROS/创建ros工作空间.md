# 在启动roslaunch之前设置Gazebo环境变量
export GAZEBO_MODEL_PATH=/ybs/share/gazebo-11/models:${GAZEBO_MODEL_PATH}
export GAZEBO_RESOURCE_PATH=/ybs/share/gazebo-11:${GAZEBO_RESOURCE_PATH}
export GAZEBO_PLUGIN_PATH=/opt/ros/noetic/lib:${GAZEBO_PLUGIN_PATH}




# 创建ros工作空间
$ mkdir -p ~/catkin_ws/src
# 命令初始化工作空间：
$ cd ~/catkin_ws/src
$ catkin_init_workspace
# 编译工作空间
$ cd ~/catkin_ws
$ catkin_make    
# 或启动多线程编译(10线程同时编译)
catkin_make -j10 -l11
永久生效: ~/.bashrc中加入:
export ROS_PARALLEL_JOBS='-j10 -l11'


# 然后启动roslaunch
roslaunch your_package your_launch_file.launch

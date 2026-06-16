如果你想单独窗口打开 usb_cam（像你之前那样）
2. launch-prefix 的基本写法
<node pkg="xxx" type="xxx.py" name="yyy" launch-prefix="gnome-terminal -- bash -ic">

可以加 launch-prefix：

<include file="$(find usb_cam)/launch/usb_cam.launch">
    <arg name="launch_prefix" value="gnome-terminal -- bash -ic" />
</include>


前提：usb_cam.launch 里的 node 有写成：

launch-prefix="$(arg launch_prefix)"


如果没有，则不能从外部控制。

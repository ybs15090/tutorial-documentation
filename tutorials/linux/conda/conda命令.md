UTF-8 LF
##管理环境
 (0)使用 conda 命令关闭自动激活
在终端中输入：
conda config --set auto_activate_base false

（1）创建虚拟环境
conda create -n env_name python=3.8

（2）查看有哪些虚拟环境
conda env list

（3）激活虚拟环境
conda activate env_name

（4）退出虚拟环境
conda deactivate

（5）删除虚拟环境
conda remove --name env_name --all
conda remove --name env_name  package_name

 (6) 克隆（复制）一个现有虚拟环境
conda create --name 新环境名 --clone 原环境名

（7）导出虚拟环境
	#获得环境中的所有配置
	conda env export --name myenv > myenv.yml
	#重新还原环境
	conda env create -f  myenv.yml

##管理包(package)

（1）查询看当前环境中安装了哪些包
conda list

（2）包的安装和更新
conda install package_name	# 在当前（虚拟）环境中安装一个包：
（3）包的卸载
conda uninstall package_name


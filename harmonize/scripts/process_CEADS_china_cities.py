import csv
import concurrent.futures
import openclimate as oc
import os
from pathlib import Path
import pandas as pd
import re
from typing import List
from typing import Dict
#from utils import make_dir

def make_dir(path=None):
    """Create a new directory at this given path.

    path = None
    """
    assert isinstance(path, str), (
        f"Path must be a string; you passed a {type(path)}"
    )

    # parents = True creates missing parent paths
    # exist_ok = True igores FileExistsError exceptions
    # these settings mimick the POSIX mkdir -p command
    Path(path).mkdir(parents=True, exist_ok=True)

# start client
client = oc.Client()

city_dict = [
    {"chinese_name": "江苏连云港", "city_name": "Lianyungang", "province": "Jiangsu"},
    {"chinese_name": "河南南阳", "city_name": "Nanyang", "province": "Henan"},
    {"chinese_name": "吉林长春", "city_name": "Changchun", "province": "Jilin"},
    {"chinese_name": "陕西商洛", "city_name": "Shangluo", "province": "Shaanxi"},
    {"chinese_name": "四川德阳", "city_name": "Deyang", "province": "Sichuan"},
    {"chinese_name": "四川雅安", "city_name": "Ya'an", "province": "Sichuan"},
    {"chinese_name": "辽宁抚顺", "city_name": "Fushun", "province": "Liaoning"},
    {"chinese_name": "广西崇左", "city_name": "Chongzuo", "province": "Guangxi"},
    {"chinese_name": "贵州毕节", "city_name": "Bijie", "province": "Guizhou"},
    {"chinese_name": "甘肃天水", "city_name": "Tianshui", "province": "Gansu"},
    {"chinese_name": "湖北十堰", "city_name": "Shiyan", "province": "Hubei"},
    {"chinese_name": "江西上饶", "city_name": "Shangrao", "province": "Jiangxi"},
    {"chinese_name": "江苏宿迁", "city_name": "Suqian", "province": "Jiangsu"},
    {"chinese_name": "甘肃嘉峪关", "city_name": "Jiayuguan", "province": "Gansu"},
    {"chinese_name": "山东烟台", "city_name": "Yantai", "province": "Shandong"},
    {"chinese_name": "辽宁沈阳", "city_name": "Shenyang", "province": "Liaoning"},
    {"chinese_name": "江西萍乡", "city_name": "Pingxiang", "province": "Jiangxi"},
    {"chinese_name": "云南昆明", "city_name": "Kunming", "province": "Yunnan"},
    {"chinese_name": "新疆塔城", "city_name": "Tacheng", "province": "Xinjiang"},
    {"chinese_name": "内蒙古鄂尔多斯", "city_name": "Ordos", "province": "Inner Mongolia"},
    {"chinese_name": "山东枣庄", "city_name": "Zaozhuang", "province": "Shandong"},
    {"chinese_name": "浙江绍兴", "city_name": "Shaoxing", "province": "Zhejiang"},
    {"chinese_name": "湖南衡阳", "city_name": "Hengyang", "province": "Hunan"},
    {"chinese_name": "广西百色", "city_name": "Baise", "province": "Guangxi"},
    {"chinese_name": "浙江宁波", "city_name": "Ningbo", "province": "Zhejiang"},
    {"chinese_name": "浙江杭州", "city_name": "Hangzhou", "province": "Zhejiang"},
    {"chinese_name": "河南驻马店", "city_name": "Zhumadian", "province": "Henan"},
    {"chinese_name": "福建南平", "city_name": "Nanping", "province": "Fujian"},
    {"chinese_name": "湖北仙桃", "city_name": "Xiantao", "province": "Hubei"},
    {"chinese_name": "四川遂宁", "city_name": "Suining", "province": "Sichuan"},
    {"chinese_name": "山东滨州", "city_name": "Binzhou", "province": "Shandong"},
    {"chinese_name": "山东泰安", "city_name": "Tai'an", "province": "Shandong"},
    {"chinese_name": "宁夏石嘴山", "city_name": "Shizuishan", "province": "Ningxia"},
    {"chinese_name": "陕西宝鸡", "city_name": "Baoji", "province": "Shaanxi"},
    {"chinese_name": "黑龙江伊春", "city_name": "Yichun", "province": "Heilongjiang"},
    {"chinese_name": "山西晋城", "city_name": "Jincheng", "province": "Shanxi"},
    {"chinese_name": "江西宜春", "city_name": "Yichun", "province": "Jiangxi"},
    {"chinese_name": "湖北随州", "city_name": "Suizhou", "province": "Hubei"},
    {"chinese_name": "甘肃武威", "city_name": "Wuwei", "province": "Gansu"},
    {"chinese_name": "新疆昌吉", "city_name": "Changji", "province": "Xinjiang"},
    {"chinese_name": "广东东莞", "city_name": "Dongguan", "province": "Guangdong"},
    {"chinese_name": "山东济南", "city_name": "Jinan", "province": "Shandong"},
    {"chinese_name": "河北张家口", "city_name": "Zhangjiakou", "province": "Hebei"},
    {"chinese_name": "河南周口", "city_name": "Zhoukou", "province": "Henan"},
    {"chinese_name": "河北唐山", "city_name": "Tangshan", "province": "Hebei"},
    {"chinese_name": "浙江台州", "city_name": "Taizhou", "province": "Zhejiang"},
    {"chinese_name": "新疆哈密","city_name": "Hami","province": "Xinjiang"},
    {"chinese_name": "江西景德镇","city_name": "Jingdezhen","province": "Jiangxi"},
    {"chinese_name": "湖北襄阳","city_name": "Xiangyang","province": "Hubei"},
    {"chinese_name": "河南鹤壁","city_name": "Hebi","province": "Henan"},
    {"chinese_name": "河南平顶山","city_name": "Pingdingshan","province": "Henan"},
    {"chinese_name": "湖南湘西","city_name": "Xiangxi","province": "Hunan"},
    {"chinese_name": "内蒙古阿拉善","city_name": "Alxa","province": "Inner Mongolia"},
    {"chinese_name": "河南开封","city_name": "Kaifeng","province": "Henan"},
    {"chinese_name": "广西北海","city_name": "Beihai","province": "Guangxi"},
    {"chinese_name": "浙江衢州","city_name": "Quzhou","province": "Zhejiang"},
    {"chinese_name": "山东德州","city_name": "Dezhou","province": "Shandong"},
    {"chinese_name": "浙江金华","city_name": "Jinhua","province": "Zhejiang"},
    {"chinese_name": "安徽黄山","city_name": "Huangshan","province": "Anhui"},
    {"chinese_name": "吉林辽源","city_name": "Liaoyuan","province": "Jilin"},
    {"chinese_name": "吉林松原", "city_name": "Songyuan", "province": "Jilin"},
    {"chinese_name": "四川眉山", "city_name": "Meishan", "province": "Sichuan"},
    {"chinese_name": "云南文山", "city_name": "Wenshan", "province": "Yunnan"},
    {"chinese_name": "广西来宾", "city_name": "Laibin", "province": "Guangxi"},
    {"chinese_name": "江苏徐州", "city_name": "Xuzhou", "province": "Jiangsu"},
    {"chinese_name": "广东汕头", "city_name": "Shantou", "province": "Guangdong"},
    {"chinese_name": "黑龙江哈尔滨", "city_name": "Harbin", "province": "Heilongjiang"},
    {"chinese_name": "湖南永州", "city_name": "Yongzhou", "province": "Hunan"},
    {"chinese_name": "河北保定", "city_name": "Baoding", "province": "Hebei"},
    {"chinese_name": "山西晋中", "city_name": "Jinzhong", "province": "Shanxi"},
    {"chinese_name": "湖南株洲", "city_name": "Zhuzhou", "province": "Hunan"},
    {"chinese_name": "湖南郴州", "city_name": "Chenzhou", "province": "Hunan"},
    {"chinese_name": "新疆克孜勒苏", "city_name": "Kizilsu", "province": "Xinjiang"},
    {"chinese_name": "山东日照", "city_name": "Rizhao", "province": "Shandong"},
    {"chinese_name": "陕西咸阳", "city_name": "Xianyang", "province": "Shaanxi"},
    {'chinese_name': '湖北宜昌', 'city_name': 'Yichang', 'province': 'Hubei'},
    {'chinese_name': '山东威海', 'city_name': 'Weihai', 'province': 'Shandong'},
    {'chinese_name': '福建宁德', 'city_name': 'Ningde', 'province': 'Fujian'},
    {'chinese_name': '河北廊坊', 'city_name': 'Langfang', 'province': 'Hebei'},
    {'chinese_name': '陕西汉中', 'city_name': 'Hanzhong', 'province': 'Shaanxi'},
    {'chinese_name': '广西梧州', 'city_name': 'Wuzhou', 'province': 'Guangxi'},
    {'chinese_name': '浙江温州', 'city_name': 'Wenzhou', 'province': 'Zhejiang'},
    {'chinese_name': '广东梅州', 'city_name': 'Meizhou', 'province': 'Guangdong'},
    {'chinese_name': '安徽宿州', 'city_name': 'Suzhou', 'province': 'Anhui'},
    {'chinese_name': '江苏苏州', 'city_name': 'Suzhou', 'province': 'Jiangsu'},
    {'chinese_name': '黑龙江牡丹江', 'city_name': 'Mudanjiang', 'province': 'Heilongjiang'},
    {'chinese_name': '江西赣州', 'city_name': 'Ganzhou', 'province': 'Jiangxi'},
    {'chinese_name': '黑龙江齐齐哈尔', 'city_name': 'Qiqihar', 'province': 'Heilongjiang'},
    {'chinese_name': '江苏盐城', 'city_name': 'Yancheng', 'province': 'Jiangsu'},
    {'chinese_name': '河南许昌', 'city_name': 'Xuchang', 'province': 'Henan'},
    {"chinese_name": "广西贺州", "city_name": "Hezhou", "province": "Guangxi"},
    {"chinese_name": "辽宁阜新", "city_name": "Fuxin", "province": "Liaoning"},
    {"chinese_name": "江西抚州", "city_name": "Fuzhou", "province": "Jiangxi"},
    {"chinese_name": "广西桂林", "city_name": "Guilin", "province": "Guangxi"},
    {"chinese_name": "湖南常德", "city_name": "Changde", "province": "Hunan"},
    {"chinese_name": "内蒙古乌海", "city_name": "Wuhai", "province": "Inner Mongolia"},
    {"chinese_name": "内蒙古乌兰察布", "city_name": "Ulanqab", "province": "Inner Mongolia"},
    {"chinese_name": "浙江舟山", "city_name": "Zhoushan", "province": "Zhejiang"},
    {"chinese_name": "福建泉州", "city_name": "Quanzhou", "province": "Fujian"},
    {"chinese_name": "湖北黄冈", "city_name": "Huanggang", "province": "Hubei"},
    {"chinese_name": "云南大理", "city_name": "Dali", "province": "Yunnan"},
    {"chinese_name": "陕西延安", "city_name": "Yan'an", "province": "Shaanxi"},
    {"chinese_name": "安徽马鞍山", "city_name": "Ma'anshan", "province": "Anhui"},
    {"chinese_name": "湖北恩施州", "city_name": "Enshi", "province": "Hubei"},
    {"chinese_name": "吉林四平", "city_name": "Siping", "province": "Jilin"},
    {"chinese_name": "安徽宣城", "city_name": "Xuancheng", "province": "Anhui"},
    {"chinese_name": "湖北潜江", "city_name": "Qianjiang", "province": "Hubei"},
    {"chinese_name": "重庆", "city_name": "Chongqing", "province": "Chongqing"},
    {"chinese_name": "福建三明", "city_name": "Sanming", "province": "Fujian"},
    {"chinese_name": "四川甘孜", "city_name": "Ganzi", "province": "Sichuan"},
    {"chinese_name": "吉林通化", "city_name": "Tonghua", "province": "Jilin"},
    {"chinese_name": "江苏南京", "city_name": "Nanjing", "province": "Jiangsu"},
    {"chinese_name": "安徽淮北", "city_name": "Huaibei", "province": "Anhui"},
    {"chinese_name": "河南濮阳", "city_name": "Puyang", "province": "Henan"},
    {"chinese_name": "广东云浮", "city_name": "Yunfu", "province": "Guangdong"},
    {"chinese_name": "江西九江", "city_name": "Jiujiang", "province": "Jiangxi"},
    {"chinese_name": "四川内江", "city_name": "Neijiang", "province": "Sichuan"},
    {"chinese_name": "黑龙江双鸭山", "city_name": "Shuangyashan", "province": "Heilongjiang"},
    {"chinese_name": "福建福州", "city_name": "Fuzhou", "province": "Fujian"},
    {"chinese_name": "河南新乡", "city_name": "Xinxiang", "province": "Henan"},
    {"chinese_name": "河北石家庄", "city_name": "Shijiazhuang", "province": "Hebei"},
    {"chinese_name": "广东茂名", "city_name": "Maoming", "province": "Guangdong"},
    {"chinese_name": "湖南益阳", "city_name": "Yiyang", "province": "Hunan"},
    {"chinese_name": "天津", "city_name": "Tianjin", "province": "Tianjin"},
    {"chinese_name": "江苏无锡", "city_name": "Wuxi", "province": "Jiangsu"},
    {"chinese_name": "广西贵港", "city_name": "Guigang", "province": "Guangxi"},
    {"chinese_name": "浙江嘉兴", "city_name": "Jiaxing", "province": "Zhejiang"},
    {"chinese_name": "湖北武汉", "city_name": "Wuhan", "province": "Hubei"},
    {"chinese_name": "湖南长沙", "city_name": "Changsha", "province": "Hunan"},
    {"chinese_name": "广东河源", "city_name": "Heyuan", "province": "Guangdong"},
    {"chinese_name": "黑龙江黑河", "city_name": "Heihe", "province": "Heilongjiang"},
    {"chinese_name": "浙江丽水", "city_name": "Lishui", "province": "Zhejiang"},
    {"chinese_name": "山东济宁", "city_name": "Jining", "province": "Shandong"},
    {"chinese_name": "浙江湖州", "city_name": "Huzhou", "province": "Zhejiang"},
    {"chinese_name": "吉林延边", "city_name": "Yanbian", "province": "Jilin"},
    {"chinese_name": "山东潍坊", "city_name": "Weifang", "province": "Shandong"},
    {"chinese_name": "陕西安康", "city_name": "Ankang", "province": "Shaanxi"},
    {"chinese_name": "黑龙江大庆", "city_name": "Daqing", "province": "Heilongjiang"},
    {"chinese_name": "吉林白城", "city_name": "Baicheng", "province": "Jilin"},
    {"chinese_name": "内蒙古呼伦贝尔", "city_name": "Hulunbuir", "province": "Inner Mongolia"},
    {"chinese_name": "山东青岛", "city_name": "Qingdao", "province": "Shandong"},
    {"chinese_name": "新疆博尔塔拉", "city_name": "Bortala Mongol Autonomous Prefecture", "province": "Xinjiang"},
    {"chinese_name": "安徽阜阳", "city_name": "Fuyang", "province": "Anhui"},
    {"chinese_name": "广西南宁", "city_name": "Nanning", "province": "Guangxi"},
    {"chinese_name": "河南洛阳", "city_name": "Luoyang", "province": "Henan"},
    {"chinese_name": "甘肃定西", "city_name": "Dingxi", "province": "Gansu"},
    {"chinese_name": "辽宁丹东", "city_name": "Dandong", "province": "Liaoning"},
    {"chinese_name": "江苏淮安", "city_name": "Huaian", "province": "Jiangsu"},
    {"chinese_name": "山东聊城", "city_name": "Liaocheng", "province": "Shandong"},
    {"chinese_name": "河南安阳", "city_name": "Anyang", "province": "Henan"},
    {"chinese_name": "甘肃金昌", "city_name": "Jinchang", "province": "Gansu"},
    {"chinese_name": "广西河池", "city_name": "Hechi", "province": "Guangxi"},
    {"chinese_name": "江苏常州", "city_name": "Changzhou", "province": "Jiangsu"},
    {"chinese_name": "山西运城", "city_name": "Yuncheng", "province": "Shanxi"},
    {"chinese_name": "安徽芜湖", "city_name": "Wuhu", "province": "Anhui"},
    {"chinese_name": "广东中山", "city_name": "Zhongshan", "province": "Guangdong"},
    {"chinese_name": "新疆喀什", "city_name": "Kashgar", "province": "Xinjiang"},
    {"chinese_name": "贵州遵义", "city_name": "Zunyi", "province": "Guizhou"},
    {"chinese_name": "安徽滁州", "city_name": "Chuzhou", "province": "Anhui"},
    {"chinese_name": "甘肃平凉", "city_name": "Pingliang", "province": "Gansu"},
    {"chinese_name": "贵州黔东南", "city_name": "Qiandongnan", "province": "Guizhou"},
    {"chinese_name": "安徽淮南", "city_name": "Huainan", "province": "Anhui"},
    {"chinese_name": "新疆伊犁州直属县", "city_name": "Yili Kazakh Autonomous Prefecture", "province": "Xinjiang"},
    {"chinese_name": "黑龙江鹤岗", "city_name": "Hegang", "province": "Heilongjiang"},
    {"chinese_name": "山东淄博", "city_name": "Zibo", "province": "Shandong"},
    {"chinese_name": "广东阳江", "city_name": "Yangjiang", "province": "Guangdong"},
    {"chinese_name": "江苏泰州", "city_name": "Taizhou", "province": "Jiangsu"},
    {"chinese_name": "福建莆田", "city_name": "Putian", "province": "Fujian"},
    {"chinese_name": "新疆克拉玛依", "city_name": "Karamay", "province": "Xinjiang"},
    {"chinese_name": "甘肃白银", "city_name": "Baiyin", "province": "Gansu"},
    {"chinese_name": "辽宁鞍山", "city_name": "Anshan", "province": "Liaoning"},
    {"chinese_name": "陕西西安", "city_name": "Xi'an", "province": "Shaanxi"},
    {"chinese_name": "广东广州", "city_name": "Guangzhou", "province": "Guangdong"},
    {"chinese_name": "广东潮州", "city_name": "Chaozhou", "province": "Guangdong"},
    {"chinese_name": "贵州六盘水", "city_name": "Liupanshui", "province": "Guizhou"},
    {"chinese_name": "吉林吉林", "city_name": "Jilin", "province": "Jilin"},
    {"chinese_name": "黑龙江大兴安岭", "city_name": "Da Hinggan Ling", "province": "Heilongjiang"},
    {"chinese_name": "内蒙古巴彦淖尔", "city_name": "Bayannur", "province": "Inner Mongolia"},
    {"chinese_name": "安徽安庆", "city_name": "Anqing", "province": "Anhui"},
    {"chinese_name": "新疆乌鲁木齐", "city_name": "Urumqi", "province": "Xinjiang"},
    {"chinese_name": "河北沧州", "city_name": "Cangzhou", "province": "Hebei"},
    {"chinese_name": "安徽巢湖", "city_name": "Chaohu", "province": "Anhui"},
    {"chinese_name": "贵州黔南", "city_name": "Qiannan", "province": "Guizhou"},
    {"chinese_name": "内蒙古呼和浩特", "city_name": "Hohhot", "province": "Inner Mongolia"},
    {"chinese_name": "内蒙古赤峰", "city_name": "Chifeng", "province": "Inner Mongolia"},
    {"chinese_name": "广东惠州", "city_name": "Huizhou", "province": "Guangdong"},
    {"chinese_name": "河北衡水", "city_name": "Hengshui", "province": "Hebei"},
    {"chinese_name": "安徽亳州", "city_name": "Bozhou", "province": "Anhui"},
    {"chinese_name": "广西柳州", "city_name": "Liuzhou", "province": "Guangxi"},
    {"chinese_name": "广西钦州", "city_name": "Qinzhou", "province": "Guangxi"},
    {"chinese_name": "广东深圳", "city_name": "Shenzhen", "province": "Guangdong"},
    {"chinese_name": "甘肃兰州", "city_name": "Lanzhou", "province": "Gansu"},
    {"chinese_name": "内蒙古包头", "city_name": "Baotou", "province": "Inner Mongolia"},
    {"chinese_name": "福建漳州", "city_name": "Zhangzhou", "province": "Fujian"},
    {"chinese_name": "湖南怀化", "city_name": "Huaihua", "province": "Hunan"},
    {"chinese_name": "湖北黄石", "city_name": "Huangshi", "province": "Hubei"},
    {"chinese_name": "山东东营", "city_name": "Dongying", "province": "Shandong"},
    {"chinese_name": "宁夏中卫", "city_name": "Zhongwei", "province": "Ningxia"},
    {"chinese_name": "河南三门峡", "city_name": "Sanmenxia", "province": "Henan"},
    {"chinese_name": "贵州铜仁", "city_name": "Tongren", "province": "Guizhou"},
    {"chinese_name": "湖南岳阳", "city_name": "Yueyang", "province": "Hunan"},
    {"chinese_name": "山西阳泉", "city_name": "Yangquan", "province": "Shanxi"},
    {"chinese_name": "广东湛江", "city_name": "Zhanjiang", "province": "Guangdong"},
    {"chinese_name": "贵州安顺", "city_name": "Anshun", "province": "Guizhou"},
    {"chinese_name": "北京", "city_name": "Beijing", "province": "Beijing"},
    {"chinese_name": "安徽合肥", "city_name": "Hefei", "province": "Anhui"},
    {"chinese_name": "山东菏泽", "city_name": "Heze", "province": "Shandong"},
    {"chinese_name": "四川自贡", "city_name": "Zigong", "province": "Sichuan"},
    {"chinese_name": "广东佛山", "city_name": "Foshan", "province": "Guangdong"},
    {"chinese_name": "安徽蚌埠", "city_name": "Bengbu", "province": "Anhui"},
    {"chinese_name": "新疆石河子", "city_name": "Shihezi", "province": "Xinjiang"},
    {"chinese_name": "广东清远", "city_name": "Qingyuan", "province": "Guangdong"},
    {"chinese_name": "青海西宁", "city_name": "Xining", "province": "Qinghai"},
    {"chinese_name": "吉林白山", "city_name": "Baishan", "province": "Jilin"},
    {"chinese_name": "黑龙江绥化", "city_name": "Suihua", "province": "Heilongjiang"},
    {"chinese_name": "山西朔州", "city_name": "Shuozhou", "province": "Shanxi"},
    {"chinese_name": "陕西渭南", "city_name": "Weinan", "province": "Shaanxi"},
    {"chinese_name": "河南信阳", "city_name": "Xinyang", "province": "Henan"},
    {"chinese_name": "广东肇庆", "city_name": "Zhaoqing", "province": "Guangdong"},
    {"chinese_name": "辽宁朝阳", "city_name": "Chaoyang", "province": "Liaoning"},
    {"chinese_name": "上海", "city_name": "Shanghai", "province": "Shanghai"},
    {"chinese_name": "广东韶关", "city_name": "Shaoguan", "province": "Guangdong"},
    {"chinese_name": "湖南湘潭", "city_name": "Xiangtan", "province": "Hunan"},
    {"chinese_name": "四川宜宾", "city_name": "Yibin", "province": "Sichuan"},
    {"chinese_name": "新疆吐鲁番", "city_name": "Turpan", "province": "Xinjiang"},
    {"chinese_name": "新疆阿克苏", "city_name": "Aksu", "province": "Xinjiang"},
    {"chinese_name": "云南红河", "city_name": "Honghe", "province": "Yunnan"},
    {"chinese_name": "辽宁辽阳", "city_name": "Liaoyang", "province": "Liaoning"},
    {"chinese_name": "内蒙古兴安盟", "city_name": "Hinggan", "province": "Inner Mongolia"},
    {"chinese_name": "山西太原", "city_name": "Taiyuan", "province": "Shanxi"},
    {"chinese_name": "福建龙岩", "city_name": "Longyan", "province": "Fujian"},
    {"chinese_name": "江西吉安", "city_name": "Ji'an", "province": "Jiangxi"},
    {"chinese_name": "安徽六安", "city_name": "Lu'an", "province": "Anhui"},
    {"chinese_name": "内蒙古通辽", "city_name": "Tongliao", "province": "Inner Mongolia"},
    {"chinese_name": "湖北孝感", "city_name": "Xiaogan", "province": "Hubei"},
    {"chinese_name": "湖南邵阳", "city_name": "Shaoyang", "province": "Hunan"},
    {"chinese_name": "四川绵阳", "city_name": "Mianyang", "province": "Sichuan"},
    {"chinese_name": "河北邢台", "city_name": "Xingtai", "province": "Hebei"},
    {"chinese_name": "辽宁盘锦", "city_name": "Panjin", "province": "Liaoning"},
    {"chinese_name": "山东临沂", "city_name": "Linyi", "province": "Shandong"},
    {"chinese_name": "四川乐山", "city_name": "Leshan", "province": "Sichuan"},
    {"chinese_name": "湖北荆门", "city_name": "Jingmen", "province": "Hubei"},
    {"chinese_name": "福建厦门", "city_name": "Xiamen", "province": "Fujian"},
    {"chinese_name": "河南郑州", "city_name": "Zhengzhou", "province": "Henan"},
    {"chinese_name": "广东珠海", "city_name": "Zhuhai", "province": "Guangdong"},
    {"chinese_name": "宁夏银川", "city_name": "Yinchuan", "province": "Ningxia"},
    {"chinese_name": "四川泸州", "city_name": "Luzhou", "province": "Sichuan"},
    {"chinese_name": "辽宁本溪", "city_name": "Benxi", "province": "Liaoning"},
    {"chinese_name": "山东莱芜", "city_name": "Laiwu", "province": "Shandong"},
    {"chinese_name": "江苏镇江", "city_name": "Zhenjiang", "province": "Jiangsu"},
    {"chinese_name": "贵州贵阳", "city_name": "Guiyang", "province": "Guizhou"},
    {"chinese_name": "内蒙古锡林郭勒", "city_name": "Xilingol", "province": "Inner Mongolia"},
    {"chinese_name": "广东汕尾", "city_name": "Shanwei", "province": "Guangdong"},
    {"chinese_name": "新疆巴音郭楞", "city_name": "Bayingolin", "province": "Xinjiang"},
    {"chinese_name": "新疆阿勒泰", "city_name": "Altay", "province": "Xinjiang"},
    {"chinese_name": "湖南张家界", "city_name": "Zhangjiajie", "province": "Hunan"},
    {"chinese_name": "辽宁大连", "city_name": "Dalian", "province": "Liaoning"},
    {"chinese_name": "四川攀枝花", "city_name": "Panzhihua", "province": "Sichuan"},
    {"chinese_name": "四川资阳", "city_name": "Ziyang", "province": "Sichuan"},
    {"chinese_name": "江苏扬州", "city_name": "Yangzhou", "province": "Jiangsu"},
    {"chinese_name": "河南焦作", "city_name": "Jiaozuo", "province": "Henan"},
    {"chinese_name": "广东江门", "city_name": "Jiangmen", "province": "Guangdong"},
    {"chinese_name": "山西长治", "city_name": "Changzhi", "province": "Shanxi"},
    {"chinese_name": "江西南昌", "city_name": "Nanchang", "province": "Jiangxi"},
    {"chinese_name": "黑龙江佳木斯", "city_name": "Jiamusi", "province": "Heilongjiang"},
    {"chinese_name": "陕西榆林", "city_name": "Yulin", "province": "Shaanxi"},
    {"chinese_name": "江西新余", "city_name": "Xinyu", "province": "Jiangxi"},
    {"chinese_name": "新疆和田", "city_name": "Hotan", "province": "Xinjiang"},
    {"chinese_name": "江西鹰潭", "city_name": "Yingtan", "province": "Jiangxi"},
    {"chinese_name": "安徽池州", "city_name": "Chizhou", "province": "Anhui"},
    {"chinese_name": "四川广元", "city_name": "Guangyuan", "province": "Sichuan"},
    {"chinese_name": "四川成都", "city_name": "Chengdu", "province": "Sichuan"},
    {"chinese_name": "宁夏吴忠", "city_name": "Wuzhong", "province": "Ningxia"},
    {"chinese_name": "安徽铜陵", "city_name": "Tongling", "province": "Anhui"},
    {"chinese_name": "山西忻州", "city_name": "Xinzhou", "province": "Shanxi"},
    {"chinese_name": "广东揭阳", "city_name": "Jieyang", "province": "Guangdong"},
    {"chinese_name": "广西防城港", "city_name": "Fangchenggang", "province": "Guangxi"},
    {"chinese_name": "江苏南通", "city_name": "Nantong", "province": "Jiangsu"},
    {"chinese_name": "河北承德", "city_name": "Chengde", "province": "Hebei"},
    {"chinese_name": "河北秦皇岛", "city_name": "Qinhuangdao", "province": "Hebei"},
    {"chinese_name": "河北邯郸", "city_name": "Handan", "province": "Hebei"},
    {"chinese_name": "河南商丘", "city_name": "Shangqiu", "province": "Henan"},
    {"chinese_name": "河南济源", "city_name": "Jiyuan", "province": "Henan"},
    {"chinese_name": "海南海口", "city_name": "Haikou", "province": "Hainan"},
    {"chinese_name": "湖北咸宁", "city_name": "Xianning", "province": "Hubei"},
    {"chinese_name": "湖北荆州", "city_name": "Jingzhou", "province": "Hubei"},
    {"chinese_name": "湖北鄂州", "city_name": "Ezhou", "province": "Hubei"},
    {"chinese_name": "甘肃张掖", "city_name": "Zhangye", "province": "Gansu"},
    {"chinese_name": "贵州黔西南", "city_name": "Qianxinan", "province": "Guizhou"},
    {"chinese_name": "黑龙江鸡西", "city_name": "Jixi", "province": "Heilongjiang"},
]


def simple_write_csv(
    output_dir: str = None,
    name: str = None,
    data = None,
    mode: str = "w",
    extension: str = "csv",
) -> None:

    if isinstance(data, dict):
        data = [data]

    with open(f"{output_dir}/{name}.{extension}", mode=mode) as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

def no_duplicates(df, col):
    """True if no duplicates"""
    return ~df.duplicated(subset=[col]).any()


def has_duplicates(df, col):
    """True if no duplicates"""
    return df.duplicated(subset=[col]).any()


def has_null_values(df, column, search_terms=[], ignore_terms=[]):
    """Check if a DataFrame column contains null values
    or any of the specified string values.

    Parameters:
        df: The DataFrame to check.
        column: The name of the column to check.
        search_terms: A list of strings to search for in the column.
        ignore_terms: A list of strings to ignore when searching for values in the column.

    Returns:
        True if any null or search term values are found in the column, False otherwise.
    """
    ignore_set = set(ignore_terms + [""])

    return any(
        pd.isnull(val)
        or (
            str(val).strip() != ""
            and str(val).strip() in search_terms
            and str(val).strip() not in ignore_set
        )
        for val in df[column]
    )

def no_null_values(df, column, search_terms=[], ignore_terms=[]):
    """Check if a DataFrame column contains null values
    or any of the specified string values.

    Parameters:
        df: The DataFrame to check.
        column: The name of the column to check.
        search_terms: A list of strings to search for in the column.
        ignore_terms: A list of strings to ignore when searching for values in the column.

    Returns:
        True if any null or search term values are found in the column, False otherwise.
    """
    return not has_null_values(df, column, search_terms=[], ignore_terms=[])

def all_actors_exist(df, part, part_type):
    import openclimate as oc
    client = oc.Client()
    parts = client.parts(part, part_type=part_type)
    part_set = set(parts['actor_id'])
    actor_set = set(df['actor_id'])
    diff_in_sets = actor_set.difference(part_set)
    return not diff_in_sets

def check_for_zero_emissions(df):
    filt = df['total_emissions'] == 0
    if any(filt):
        print('WARNING!! Check the following emission_ids, total_emission is zero:')
        print(df.loc[filt, 'emissions_id'].to_list())
    else:
        print('Look good!')

def get_id(prov):
    try:
        if (prov == 'Inner mongolia') | (prov == 'InnerMongolia') | (prov == 'Inner Mongolia'):
            # inner mongolia also called Nei Mongol
            return {'province': prov, 'province_id': 'CN-NM'}
        df = client.search(query=prov)
        filt = df['type'] == 'adm1'
        return {'province': prov, 'province_id':df.loc[filt].get('actor_id').to_list()[0]}
    except:
        return {'province': prov, 'province_id':None}

def get_actor_id(province_id, city):
    parts = client.parts(province_id, part_type='city')
    try:
        actor_id = parts.loc[parts.name == city, 'actor_id'].item()
        return {'province_id': province_id, 'city_name': city, 'actor_id': actor_id}
    except ValueError:
        return {'province_id': province_id, 'city_name': city, 'actor_id': None}


if __name__ == "__main__":
    # where to create tables
    outputDir = "../data/processed/CEADS_china_cities"
    outputDir = os.path.abspath(outputDir)
    make_dir(path=Path(outputDir).as_posix())

    # CEADS china
    fl = '../data/raw/CEADS_china_cities/The_Emission_Inventories_for_290_Chinese_Cities_from_1997_to_2019.xlsx'
    fl = os.path.abspath(fl)

    # ------------------------------------------
    # Publisher table
    # ------------------------------------------
    PUBLISHER_DICT = {
        'id': 'CEADs',
        'name': 'Carbon Emissions Accounts and Datasets for emerging economies',
        'URL': 'https://www.ceads.net/'
    }

    simple_write_csv(
        output_dir=outputDir, name="Publisher", data=PUBLISHER_DICT, mode="w"
    )

    # ------------------------------------------
    # DataSource table
    # ------------------------------------------
    DATASOURCE_DICT = {
        'datasource_id': 'CEADS:shan_etal_2022:china_cities',
        'name': 'The Emission Inventories for 290 Chinese Cities from 1997 to 2019',
        'publisher': f"{PUBLISHER_DICT['id']}",
        'published': '2022-09-30',
        'URL': 'https://ceads.net/data/city/',
        'citation': "Shan et al. (2022). City-level emission peak and drivers in China. Science Bulletin, 67(18), 1910-1920. doi:10.1016/j.scib.2022.08.024"
    }

    simple_write_csv(
        output_dir=outputDir, name="DataSource", data=DATASOURCE_DICT, mode="w"
    )

    # ------------------------------------------
    # EmissionsAgg table
    # ------------------------------------------
    ASTYPE_DICT = {
        'emissions_id': str,
        'actor_id': str,
        'year': int,
        'total_emissions': int,
        'datasource_id': str
    }

    df = pd.read_excel(fl, sheet_name='emission vector')

    cities = list(set(df['city']))
    df_cities = pd.DataFrame(city_dict)
    data = [get_id(province) for province in set(df_cities['province'])]
    df_prov_iso = pd.DataFrame(data)
    df_merged = df_cities.merge(df_prov_iso, on='province')

    # state name to iso2
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = [executor.submit(get_actor_id, prov, city)
                for prov, city in df_merged[['province_id', 'city_name']].values.tolist()]
        data = [f.result() for f in concurrent.futures.as_completed(results)]

    # put iso code in dataframe
    df_actor_id = pd.DataFrame(data)
    df_out = df_merged.merge(df_actor_id, on=['province_id', 'city_name'])
    df_final = df.merge(df_out, left_on='city', right_on='chinese_name')

    df_emissionsAgg = (
        df_final
        .loc[lambda x: x['actor_id'].notnull()]
        .assign(
            total_emissions = lambda x: x['emission'] * 1_000_000,
            datasource_id = DATASOURCE_DICT['datasource_id'],
            emissions_id = lambda x: x.apply(lambda row: f"CEADS:{row['actor_id']}:{row['year']}", axis=1)
        )
        .loc[:, ASTYPE_DICT.keys()]
        .astype(ASTYPE_DICT)
        .sort_values(by=['actor_id', 'year'])
        .reset_index(drop=True)
    )

    # sanity check
    sanity_check = all([
        no_duplicates(df_emissionsAgg, 'emissions_id'),
        no_null_values(df_emissionsAgg, 'actor_id'),
        no_null_values(df_emissionsAgg, 'year'),
        no_null_values(df_emissionsAgg, 'total_emissions'),
        ])

    # save to csv
    if sanity_check:
        df_emissionsAgg.to_csv(f"{outputDir}/EmissionsAgg.csv", index=False)
    else:
        print('check emissionsAgg for duplicates and null values')

    check_for_zero_emissions(df_emissionsAgg)

    # =================================================================
    # Tags and DataSourceTags
    # =================================================================
    # dictionary of tag_id : tag_name
    tagDict = {
        "CO2_only": "CO2 only",
        "following_ipcc_2006": "Following IPCC (2006) Guidelines for National Greenhouse Gas Inventories",
    }

    tagDictList = [{"tag_id": key, "tag_name": value} for key, value in tagDict.items()]

    simple_write_csv(outputDir, "Tag", tagDictList)

    dataSourceTagDictList = [
        {"datasource_id": DATASOURCE_DICT["datasource_id"], "tag_id": tag["tag_id"]}
        for tag in tagDictList
    ]

    simple_write_csv(outputDir, "DataSourceTag", dataSourceTagDictList)


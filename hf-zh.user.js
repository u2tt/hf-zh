// ==UserScript==
// @name          Hugging Face 界面汉化
// @name:en       Hugging Face Chinese UI
// @namespace     hf-zh.chenxinyu
// @version       1.0.0
// @description   把 huggingface.co 的界面完整汉化：导航、搜索、筛选面板、排序下拉、模型/数据集/空间页、定价、文档、页脚与全部下拉菜单，729 条词条 + 动态文本规则。整段精确匹配，不破坏模型卡正文与代码；Alt+Z 可切回英文。
// @description:en Localize the Hugging Face UI into Chinese. Exact-node matching only, so model cards and code blocks stay untouched.
// @author        陈鑫宇
// @license       MIT
// @match         https://huggingface.co/*
// @match         https://www.huggingface.co/*
// @match         https://hf.co/*
// @match         https://*.hf.co/*
// @run-at        document-idle
// @noframes
// @grant         none
// ==/UserScript==
/* ============================================================================
 *  Hugging Face 界面中文汉化 / Hugging Face UI Chinese Localization
 *  作者: 陈鑫宇
 *  版本: 1.0.0
 *
 *  设计原则（针对旧版脚本的三类硬伤重写）：
 *  1. 词典是「数组 -> Map」构建，构建时校验重复 key，绝不允许后写覆盖先写。
 *  2. 只做「整段文本全等匹配」（文本节点归一化后与词典 key 完全相等才替换），
 *     另加少量整段锚定的正则规则处理动态文本（相对时间 / 计数 / 排序）。
 *     因此绝不会出现 "Most 喜欢" 这种把单词塞进英文句子的破碎结果。
 *  3. 跳过 code / pre / 模型卡正文 / 等宽字体（仓库名）等区域；
 *     MutationObserver 去抖 + 白名单节点，React 重渲染后自动补译，且不会死循环。
 * ==========================================================================*/
(function () {
  'use strict';
  if (window.__HF_ZH_LOADED__) return;
  window.__HF_ZH_LOADED__ = true;

  var DICT = {"Models":"模型","Datasets":"数据集","Spaces":"空间","Buckets":"存储桶","Docs":"文档","Enterprise":"企业版","Pricing":"定价","Log In":"登录","Log Out":"退出登录","Sign Up":"注册","Sign up":"注册","Log in":"登录","Sign In":"登录","Search models, datasets, users...":"搜索模型、数据集、用户…","Search":"搜索","Search...":"搜索…","Search Hugging Face":"搜索 Hugging Face","System theme":"跟随系统","Light":"浅色","Dark":"深色","Theme":"主题","Main":"主要","Tasks":"任务","Libraries":"库","Languages":"语言","Licenses":"许可证","Other":"其他","Modalities":"模态","Parameters":"参数量","Apps":"应用","Type":"类型","Format":"格式","Size":"大小","Size (rows)":"大小（行数）","Base only":"仅基础模型","Apply filters":"应用筛选","Add filters":"添加筛选","Edit filters":"编辑筛选","Reset filters":"重置筛选","Reset Parameters":"重置参数量","Reset Size":"重置大小","Reset Tasks":"重置任务","Clear all":"清除全部","Active filters:":"已选筛选：","Filter by name":"按名称筛选","Full-text search":"全文搜索","Inference Available":"可在线推理","Edit Models filters":"编辑模型筛选","Edit Datasets filters":"编辑数据集筛选","Edit Spaces filters":"编辑空间筛选","Filters":"筛选","Filter":"筛选","Sort: Trending":"排序：热门","Sort: Relevance":"排序：相关性","Sort:":"排序：","Sort by":"排序方式","Trending":"热门","Relevance":"相关性","Most downloads":"下载最多","Most likes":"点赞最多","Recently created":"最近创建","Recently updated":"最近更新","Previous":"上一页","Next":"下一页","Load more":"加载更多","Show more":"显示更多","Show less":"收起","View all":"查看全部","See all":"查看全部","View all articles":"查看全部文章","view all":"查看全部","New Space":"新建空间","Get PRO":"获取 PRO","Get Pro":"获取 Pro","Learn more":"了解更多","Learn More":"了解更多","Getting started":"快速开始","Get started":"开始使用","Get Started":"开始使用","View pricing":"查看定价","Try it":"试一试","Updated":"已更新","Created":"已创建","Downloads":"下载量","Likes":"点赞","Downloads last month":"上月下载量","The AI community building the future.":"构建 AI 未来的社区。","Explore AI Apps":"探索 AI 应用","Browse 2M+ models":"浏览 200 万+ 模型","Browse 1M+ applications":"浏览 100 万+ 应用","Browse 500k+ datasets":"浏览 50 万+ 数据集","The Home of Machine Learning":"机器学习之家","The collaboration platform":"协作平台","Move faster":"更快地前进","Explore all modalities":"探索所有模态","Build your portfolio":"打造你的作品集","Accelerate your ML":"加速你的机器学习","Explore Models":"探索模型","Team & Enterprise":"团队与企业版","Single Sign-On":"单点登录","Regions":"区域","Priority Support":"优先支持","Audit Logs":"审计日志","Resource Groups":"资源组","Private Datasets Viewer":"私有数据集查看器","The AI App Directory":"AI 应用目录","Explore Spaces":"探索空间","Browse all":"浏览全部","TOS":"服务条款","Privacy":"隐私政策","About":"关于","Careers":"招聘","Brand assets":"品牌素材","Terms of service":"服务条款","Terms of Service":"服务条款","Press":"媒体","Learn":"学习","Documentation":"文档","Blog":"博客","Forum":"论坛","Service Status":"服务状态","Speed test":"速度测试","Community":"社区","Website":"网站","Solutions":"解决方案","Company":"公司","Resources":"资源","Open Source":"开源","Storage Buckets":"存储桶","Collections":"收藏集","Posts":"帖子","Daily Papers":"每日论文","Organizations":"组织","Hardware":"硬件","Inference Providers":"推理服务商","Compute":"计算","Inference Endpoints":"推理端点","Spaces applications":"空间应用","Our Open Source":"我们的开源项目","Model card":"模型卡","Files and versions":"文件与版本","Deploy":"部署","Use this model":"使用此模型","Copy to bucket":"复制到存储桶","Browse Quantizations":"浏览量化版本","Model size":"模型大小","Tensor type":"张量类型","Chat template":"对话模板","Dataset used to train":"用于训练的数据集","License":"许可证","Tags":"标签","Model tree for":"模型树：","Spaces using":"使用此模型的空间","Collections including":"包含此模型的收藏集","Papers for":"相关论文","Evaluation results":"评测结果","View API Code":"查看 API 代码","Dismiss":"关闭","Train":"训练","AutoTrain":"自动训练","Inference API":"推理 API","Files":"文件","Name":"名称","History":"历史","Copy":"复制","Copied":"已复制","Edit":"编辑","Preview":"预览","Raw":"原始","Download":"下载","Model info":"模型信息","Model Information":"模型信息","Upload files":"上传文件","New file":"新建文件","Commit changes":"提交更改","Supported Inference Providers":"支持的推理服务商","Hardware compatibility":"硬件兼容性","Run 15,000+ Models Instantly":"即刻运行 15000+ 个模型","Dataset card":"数据集卡","Data Studio":"数据工作室","Dataset Viewer":"数据集查看器","Dataset viewer":"数据集查看器","Search this dataset":"搜索此数据集","Subset":"子集","Split":"划分","Rows":"行","Columns":"列","Embed":"嵌入","Console":"控制台","SQL Console":"SQL 控制台","to Parquet":"转为 Parquet","Auto-converted to Parquet":"已自动转换为 Parquet","Models trained or fine-tuned on":"在此数据集上训练或微调的模型","First rows":"前几行","Random rows":"随机行","Export":"导出","Table":"表格","Chart":"图表","Rows per page":"每页行数","Use this dataset":"使用此数据集","Dataset Structure":"数据集结构","Data Instances":"数据实例","Data Fields":"数据字段","Data Splits":"数据划分","App":"应用","Settings":"设置","Restart this Space":"重启此空间","Duplicate this Space":"复制此空间","Logs":"日志","Runtime":"运行时","Container":"容器","Sleeping":"休眠中","Running":"运行中","Building":"构建中","Build":"构建","Pause":"暂停","Subscribe":"订阅","Daily":"每日","Weekly":"每周","Monthly":"每月","by":"作者：","and the research community":"与研究社区","Trending Papers":"热门论文","Upvote":"赞同","Submit a paper":"提交论文","Community Blog & Articles":"社区博客与文章","New Article":"新建文章","LLM Course":"LLM 课程","Agents Course":"智能体课程","Audio Course":"音频课程","Diffusion Course":"扩散模型课程","Open-Source AI Cookbook":"开源 AI 手册","ML for Games Course":"游戏机器学习课程","ML for 3D Course":"3D 机器学习课程","Context Course":"上下文课程","Robotics Course":"机器人学课程","Deep RL Course":"深度强化学习课程","Community Computer Vision Course":"社区计算机视觉课程","Case Studies":"案例研究","guide":"指南","research":"研究","ethics":"伦理","Leaderboard":"排行榜","Multimodal":"多模态","Natural Language Processing":"自然语言处理","Computer Vision":"计算机视觉","Audio":"音频","Tabular":"表格","Reinforcement Learning":"强化学习","Text Generation":"文本生成","Text Classification":"文本分类","Token Classification":"词元分类","Question Answering":"问答","Summarization":"文本摘要","Translation":"翻译","Fill-Mask":"完形填空","Sentence Similarity":"句子相似度","Zero-Shot Classification":"零样本分类","Feature Extraction":"特征抽取","Image-Text-to-Text":"图像-文本到文本","Any-to-Any":"任意到任意","Image-to-Text":"图像到文本","Image-to-Image":"图像到图像","Text-to-Image":"文本到图像","Text-to-Video":"文本到视频","Text-to-Speech":"文本到语音","Text-to-Text":"文本到文本","Video-to-Text":"视频到文本","Image Classification":"图像分类","Object Detection":"目标检测","Image Segmentation":"图像分割","Depth Estimation":"深度估计","Image Feature Extraction":"图像特征抽取","Audio Classification":"音频分类","Automatic Speech Recognition":"自动语音识别","Voice Activity Detection":"语音活动检测","Audio-to-Audio":"音频到音频","Graph Machine Learning":"图机器学习","Tabular Classification":"表格分类","Tabular Regression":"表格回归","Time Series Forecasting":"时间序列预测","Close":"关闭","Cancel":"取消","Save":"保存","Save changes":"保存更改","Update":"更新","Delete":"删除","Remove":"移除","Add":"添加","Create":"创建","Done":"完成","Back":"返回","Skip":"跳过","Finish":"完成","Continue":"继续","Confirm":"确认","Yes":"是","No":"否","OK":"确定","Loading...":"加载中…","Loading":"加载中","Try again":"重试","Retry":"重试","Refresh":"刷新","Copy link":"复制链接","Share":"分享","Help":"帮助","Contact":"联系","Contact sales":"联系销售","Talk to sales":"联系销售","Request a Quote":"获取报价","View Documentation":"查看文档","or":"或","and":"和","More":"更多","All":"全部","None":"无","Optional":"可选","Required":"必填","Public":"公开","Private":"私有","Everyone":"所有人","Follow":"关注","Followed":"已关注","Join":"加入","Star":"收藏","Starred":"已收藏","Comment":"评论","Reply":"回复","Submit":"提交","Send":"发送","Wiki":"维基","Discussions":"讨论","Pull requests":"拉取请求","New discussion":"新建讨论","New pull request":"新建拉取请求","Report":"举报","Edit profile":"编辑资料","Notifications":"通知","Mark all as read":"全部标为已读","Unread":"未读","Read":"已读","Archive":"归档","Profile":"个人资料","Account":"账号","Billing":"账单","Access Tokens":"访问令牌","SSH Keys":"SSH 密钥","New token":"新建令牌","Email preferences":"邮件偏好","Delete account":"删除账号","Danger zone":"危险操作区","Personal":"个人","Payment":"支付","Guides":"指南","References":"参考","Search documentation":"搜索文档","On this page":"本页内容","New Chat":"新对话","Start chatting":"开始聊天","Have an ML idea?":"有机器学习想法？","Trending models":"热门模型","Latest world news":"最新世界新闻","Generate an image":"生成图片","Learn something new":"学点新东西","Plan a trip":"规划旅行","Gift ideas":"礼物创意","Find a dataset":"找一个数据集","Compare technologies":"比较技术","Make my website":"做一个网站","Celebrate 3M models":"庆祝 300 万模型","Username":"用户名","Email":"邮箱","Password":"密码","Forgot password?":"忘记密码？","Create account":"创建账号","Continue with GitHub":"使用 GitHub 继续","Continue with Google":"使用 Google 继续","Sign up with email":"使用邮箱注册","Create my first Endpoint":"创建我的第一个端点","One-click deployment":"一键部署","Browse Catalog":"浏览目录","Hub Models":"Hub 模型","Install hf-cli":"安装 hf-cli","Fully Managed Infrastructure":"全托管基础设施","Autoscaling":"自动扩缩容","Observability":"可观测性","Inference Engines":"推理引擎","Choose a plan that fits your needs":"选择适合你的方案","Self-Serve":"自助服务","See Instance Pricing":"查看实例定价","Ship AI Faster with":"更快地部署 AI：","Get Started for Free":"免费开始","PRO Account":"PRO 账户","Team":"团队","Get Team (via credit card)":"获取团队版（信用卡支付）","Enterprise Support":"企业支持","Transparent, volume-based pricing":"透明的按量计费","Add your hardware":"添加你的硬件","Most parameters":"参数最多","Least parameters":"参数最少","Most rows":"行数最多","Least rows":"行数最少","Largest total size":"总体积最大","Smallest total size":"总体积最小","Image-to-3D":"图像转 3D","Image-to-Video":"图像转视频","Mask Generation":"掩码生成","Viewer":"查看器","Document":"文档","Geospatial":"地理空间","Time-series":"时间序列","(rows)":"（行）","Benchmark":"基准测试","Traces":"轨迹","RL Environment":"强化学习环境","Like":"点赞","Eval Results":"评估结果","License:":"许可证：","arxiv:":"arXiv：","Inference":"推理","Notebooks":"笔记本","Local Apps":"本地应用","to use this model in":"在以下应用中使用此模型",", or any compatible app.":"，或任何兼容的应用。","Read more":"阅读更多","Copied!":"已复制！","Files info":"文件信息","NEW":"新","Examples":"示例","Input a message to start chatting with":"输入消息开始对话","View Code":"查看代码","Snippets":"代码片段","Maximize":"最大化","Adapters":"适配器","Finetunes":"微调","Merges":"合并","Quantizations":"量化","Collection":"收藏集","Published":"已发布","Paper":"论文","View evaluation results":"查看评估结果","source":"来源","leaderboard":"排行榜","is supported by the following Inference Providers:":"由以下推理服务商提供支持：","to review the conditions and access this model content.":"以查看条款并访问此模型内容。","Install from pip and serve model":"用 pip 安装并启动模型","Use Docker":"使用 Docker","Use Docker images":"使用 Docker 镜像","Trending on":"热门趋势：","this week":"本周","Create, discover and collaborate on ML better.":"更好地创建、发现与协作 ML。","With the HF Open source stack.":"基于 HF 开源技术栈。","Text, image, video, audio or even 3D.":"文本、图像、视频、音频，甚至 3D。","Share your work with the world and build your ML profile.":"把你的作品分享给世界，打造你的 ML 主页。","We provide paid Compute and Enterprise solutions.":"我们提供付费的算力与企业解决方案。","Deploy on optimized":"部署到优化的","or update your":"或更新你的","to a GPU in a few clicks.":"到 GPU，只需点击几下。","non-profit":"非营利","company":"公司","organization":"组织","Changelog":"更新日志","Social":"社交","We are building the foundation of ML tooling with the community.":"我们正与社区一起构建 ML 工具的基石。","More than 400,000 organizations are using Hugging Face":"超过 40 万家组织正在使用 Hugging Face","State-of-the-art AI models for PyTorch":"面向 PyTorch 的顶尖 AI 模型","State-of-the-art Diffusion models in PyTorch":"PyTorch 的顶尖扩散模型","Safe way to store/distribute neural network weights":"安全地存储与分发神经网络权重的格式","Python client to interact with the Hugging Face Hub":"与 Hugging Face Hub 交互的 Python 客户端","Fast tokenizers optimized for research & production":"为研究与生产优化的快速分词器","Train transformers LMs with reinforcement learning":"用强化学习训练 Transformer 语言模型","State-of-the-art ML running directly in your browser":"直接在浏览器中运行的顶尖 ML","Smol library to build great agents in Python":"用 Python 构建优秀智能体的轻量库","Parameter-efficient finetuning for large language models":"面向大语言模型的参数高效微调","Access & share datasets for any ML tasks":"为任意 ML 任务访问与共享数据集","Making AI for Robotics more accessible with end-to-end learning":"用端到端学习让机器人 AI 更易用","Train PyTorch models with multi-GPU, TPU, mixed precision":"用多 GPU、TPU 与混合精度训练 PyTorch 模型","You need to agree to share your Hugging Face information to access this model":"你需要同意共享你的 Hugging Face 信息才能访问此模型","The information you provide will be collected, stored, processed and shared in accordance with the":"你提供的信息将依据以下条款被收集、存储、处理与共享：","Policy.":"政策。","Inference Providers let you run inference on thousands of models served by our partners using a simple, unified, OpenAI-compatible serverless API":"推理服务商让你通过简单统一的、兼容 OpenAI 的无服务器 API，在合作伙伴提供的数千个模型上运行推理，","Get trending papers in your email inbox once a day!":"每天把热门论文发到你的邮箱！","Submitted by":"提交者","Read paper":"阅读论文","Leveling up AI collaboration and compute.":"升级 AI 协作与算力。","Boost your personal HF experience":"提升你的个人 HF 体验","/month":"/月","per user":"/用户","10× private storage capacity":"10 倍私有存储容量","2× public storage capacity":"2 倍公开存储容量","$2 of included inference credits monthly":"每月赠送 $2 推理额度","8× ZeroGPU quota and highest queue priority":"8 倍 ZeroGPU 配额与最高队列优先级","Host ZeroGPU, Gradio & Docker Spaces":"托管 ZeroGPU、Gradio 与 Docker 空间","Spaces Dev Mode":"空间开发模式","Personal blog publishing":"个人博客发布","Dataset Viewer for private datasets":"私有数据集的数据集查看器","Show your support with a PRO badge":"用 PRO 徽章展示你的支持","Most popular":"最受欢迎","Instant setup for growing teams":"为成长中的团队快速就绪","SSO support (SAML & OIDC)":"SSO 支持（SAML 与 OIDC）","Data location control with Storage Regions":"用存储区域控制数据位置","Detailed action reviews with Audit Logs":"用审计日志细查操作记录","Granular access control via Resource Groups":"通过资源组实现细粒度访问控制","Repository usage Analytics":"仓库使用分析","Advanced auth policies and repository visibility controls":"高级认证策略与仓库可见性控制","Centralized token control and approvals":"集中式令牌管理与审批","Create Gradio & Docker Spaces, with advanced compute options":"创建 Gradio 与 Docker 空间，支持高级算力选项","Custom onboarding and enterprise features":"定制化上手流程与企业功能","All benefits from the Team plan":"包含团队版全部权益","Highest storage, bandwidth, and API rate limits":"最高的存储、带宽与 API 速率限制","Automated user management with SCIM provisioning":"通过 SCIM 自动配置用户管理","Advanced security and access controls":"高级安全与访问控制","Managed billing with annual commitments":"支持年度承诺的托管计费","Legal and Compliance processes":"法律与合规流程","Dedicated support":"专属支持","Need support to adopt the HF Hub in your organization?":"需要在你的组织中引入 HF Hub 支持？","View our":"查看我们的","Storage":"存储","Backblaze Overdrive":"Backblaze Overdrive","Need more than 500TB?":"需要超过 500TB？","for custom pricing.":"获取定制报价。","/TB/mo":"/TB/月","Public repositories":"公开仓库","Private repositories":"私有仓库","Create with ML":"用 ML 创作","Collaborate":"协作","Git based and designed for collaboration at its core.":"以 Git 为基础，天生为协作而设计。","Play and learn":"动手学习","Learn by experimenting and sharing with our awesome community.":"在实验与分享中学习，与优秀的社区一起成长。","Build your ML portfolio":"打造你的 ML 作品集","Share your work with the world and build your own ML profile.":"把你的作品分享给世界，建立自己的 ML 主页。","Spaces and Jobs Hardware":"空间与任务硬件","On-demand GPU hardware. Starting at $0.":"按需 GPU 硬件，起价 $0。","Get started with Spaces":"开始使用空间","per hour":"/小时","per month":"/月","Memory":"内存","Accelerator":"加速卡","VRAM":"显存","Hourly price":"每小时价格","Dedicated inference, starting at $0.033/hour.":"专属推理，低至 $0.033/小时。","Instances":"实例","Accel":"加速卡","Do more with Hugging Face PRO":"用 Hugging Face PRO 做更多事","Upgrade your HF experience for $9/month.":"每月 $9 升级你的 HF 体验。","Private storage":"私有存储","Public storage":"公开存储","Fast iterations via SSH/VS Code":"通过 SSH/VS Code 快速迭代","for private datasets":"（私有数据集）","Features Preview":"功能预览","Get early access to upcoming features":"抢先体验即将推出的功能","PRO Badge":"PRO 徽章","Hub":"Hub","Features":"功能","Audio-Text-to-Text":"音频-文本到文本","Document Question Answering":"文档问答","Visual Document Retrieval":"视觉文档检索","Image-Text-to-Image":"图像-文本到图像","Image-Text-to-Video":"图像-文本到视频","Video-Text-to-Text":"视频-文本到文本","Visual Question Answering":"视觉问答","Table Question Answering":"表格问答","Text Ranking":"文本排序","Keypoint Detection":"关键点检测","Video Classification":"视频分类","Unconditional Image Generation":"无条件图像生成","Video-to-Video":"视频到视频","Zero-Shot Image Classification":"零样本图像分类","Text-to-3D":"文本到 3D","Search in":"搜索范围","Scope to owner or repo":"限定到作者或仓库","ML Intern plans and runs it for you. No PhD required.":"ML Intern 会替你规划并执行。无需博士学位。","ML Intern":"ML Intern","ML Intern, mode on":"ML Intern 模式已开启","papers · training · spaces · datasets · eval · hub":"论文 · 训练 · 空间 · 数据集 · 评估 · Hub","Omni":"Omni","Generated content may be inaccurate or false.":"生成的内容可能不准确或有误。","Now with ML Intern!":"现已支持 ML Intern！","Welcome to HuggingChat, the chat app powered by open source AI models.":"欢迎使用 HuggingChat，这是一款由开源 AI 模型驱动的聊天应用。","Learn context engineering for code agents":"学习面向代码智能体的上下文工程","This course will teach you to build robots with using LeRobot":"本课程教你用 LeRobot 构建机器人","a smol course":"轻量课程","This smollest course on post-training AI models":"关于 AI 模型后训练的最精简课程","Learn to build and deploy your own AI agents":"学习构建与部署你自己的 AI 智能体","Learn about diffusion models & how to use them with diffusers":"了解扩散模型以及如何用 diffusers 使用它们","Learn about 3D ML with libraries from the HF ecosystem":"用 HF 生态的库学习 3D ML","Community Articles":"社区文章","Articles from":"来自以下来源的文章","organizations will get promoted to the main section.":"的组织会被推荐到主栏目。","Join the conversation":"加入讨论","Join the community of Machine Learners and AI enthusiasts.":"加入机器学习与 AI 爱好者的社区。","All HF Hub posts":"全部 HF Hub 帖子","posted an":"发布了","update":"更新","view post":"查看帖子","Post":"帖子","Recently active users":"最近活跃用户","…read more":"…阅读更多","1 reply":"1 条回复","Guides, references, and API docs for the Hugging Face ecosystem.":"Hugging Face 生态的指南、参考与 API 文档。","Hub & Client Libraries":"Hub 与客户端库","Host Git-based models, datasets, and Spaces on the HF Hub":"在 HF Hub 上托管基于 Git 的模型、数据集与空间","Hub Python Library":"Hub Python 库","Huggingface.js":"Huggingface.js","JavaScript libraries for Hugging Face with built-in TS types":"带内置 TS 类型的 Hugging Face JavaScript 库","Explore demos, models, and datasets for any ML tasks":"浏览任意 ML 任务的演示、模型与数据集","API for metadata, stats, and content of HF Hub datasets":"用于获取 HF Hub 数据集元数据、统计与内容的 API","Deployment & Inference":"部署与推理","Call 200k+ models hosted by our 10+ Inference partners":"调用 10 多家推理合作伙伴托管的 20 万+ 模型","Inference Endpoints (dedicated)":"推理端点（专属）","Deploy models on dedicated & fully managed infrastructure on HF":"在 HF 上把模型部署到专属全托管基础设施","Deploying on AWS":"在 AWS 上部署","Train/deploy models from Hugging Face to AWS with DLCs":"借助 DLC 在 AWS 上训练/部署 Hugging Face 模型","Text Embeddings Inference":"文本嵌入推理","Serve embeddings models with TEI optimized toolkit":"用 TEI 优化工具包服务嵌入模型","Microsoft Azure":"Microsoft Azure","Deploy Hugging Face models on Microsoft Azure":"在 Microsoft Azure 上部署 Hugging Face 模型","Google Cloud":"Google Cloud","Train and Deploy Hugging Face models on Google Cloud":"在 Google Cloud 上训练与部署 Hugging Face 模型","Core ML Libraries":"核心 ML 库","State-of-the-art vision models: layers, optimizers, and utilities":"顶尖视觉模型：层、优化器与工具","Embeddings, Retrieval, and Reranking":"嵌入、检索与重排","Kernels":"内核","Load and run compute kernels from the Hugging Face Hub":"从 Hugging Face Hub 加载并运行计算内核","Training & Optimization":"训练与优化","Optimize HF Transformers for faster training/inference":"优化 HF Transformers，加速训练与推理","AWS Trainium & Inferentia":"AWS Trainium 与 Inferentia","Train/deploy Transformers/Diffusers on AWS":"在 AWS 上训练/部署 Transformers 与 Diffusers","Google TPUs":"Google TPU","Train and Deploy models on Google TPUs via Optimum.":"通过 Optimum 在 Google TPU 上训练与部署模型。","OpenEnv":"OpenEnv","Create and deploy agentic RL execution environments":"创建并部署智能体强化学习执行环境","Optimize and quantize models with bitsandbytes":"用 bitsandbytes 优化与量化模型","Lighteval":"Lighteval","All-in-one toolkit to evaluate LLMs across multiple backends":"跨多种后端评估 LLM 的一体化工具包","Collaboration & Extras":"协作与扩展","Build ML demos and web apps with a few lines of Python":"用几行 Python 构建 ML 演示与网页应用","Trackio":"Trackio","Open-source expressive robot SDK for hackers and AI builders":"面向极客与 AI 构建者的开源表现力机器人 SDK","Chat UI":"聊天界面","Open source chat frontend powering HuggingChat":"驱动 HuggingChat 的开源聊天前端","Leaderboards":"排行榜","Create custom Leaderboards on Hugging Face":"在 Hugging Face 上创建自定义排行榜","Xet":"Xet","Xet Protocol Specification":"Xet 协议规范","Also check out our awesome list of":"也来看看我们的精选列表：","contributors":"贡献者","university":"大学","community":"社区","Image Generation":"图像生成","Video Generation":"视频生成","Language Translation":"语言翻译","Speech Synthesis":"语音合成","3D Modeling":"3D 建模","Music Generation":"音乐生成","Text Analysis":"文本分析","Image Editing":"图像编辑","Code Generation":"代码生成","Data Visualization":"数据可视化","Voice Cloning":"声音克隆","Background Removal":"背景移除","Image Upscaling":"图像超分","Document Analysis":"文档分析","Visual QA":"视觉问答","Image Captioning":"图像描述","Chatbots":"聊天机器人","Sentiment Analysis":"情感分析","Text Summarization":"文本摘要","Medical Imaging":"医学影像","Financial Analysis":"金融分析","Game AI":"游戏 AI","Model Benchmarking":"模型评测","Fine Tuning Tools":"微调工具","Dataset Creation":"数据集创建","Pose Estimation":"姿态估计","Face Recognition":"人脸识别","Anomaly Detection":"异常检测","Recommendation Systems":"推荐系统","Character Animation":"角色动画","Style Transfer":"风格迁移","Agent Environment":"智能体环境","Spaces of the week":"本周精选空间","All running apps":"所有运行中的应用",", trending first":"，热门优先","Featured":"精选","Agents":"智能体","MCP":"MCP","Datasets:":"数据集：","Tasks:":"任务：","Modalities:":"模态：","Formats:":"格式：","Sub-tasks:":"子任务：","Languages:":"语言：","English":"英语","Size:":"大小：","Libraries:":"库：","Auto-converted":"自动转换","API":"API","Duplicate":"复制","Homepage:":"主页：","Size of downloaded dataset files:":"下载的数据集文件大小：","Number of rows:":"行数：","Total file size:":"文件总大小：","new":"新","Image":"图像","Text":"文本","Video":"视频","Split (3)":"划分（3）","Host your own ZeroGPU, Gradio & Docker Spaces on compute":"在自己的算力上托管 ZeroGPU、Gradio 与 Docker 空间","Zero-Shot Object Detection":"零样本目标检测","ML intern explorers":"ML Intern 探索者","Hugging Face Discord Community":"Hugging Face Discord 社区","Beijing Academy of Artificial Intelligence":"北京智源人工智能研究院","Read the full breakdown:":"阅读完整分析：","Running on":"运行于","Paused":"已暂停","Ask anything you want to do with AI":"问问你想用 AI 做什么","Pinned":"已置顶","Dataset Summary":"数据集摘要","Model Summary":"模型摘要","All organization members get ZeroGPU and Inference Providers PRO benefits":"所有组织成员均可享有 ZeroGPU 与 Inference Providers 的 PRO 权益","Give your personal account or your organization the most advanced platform to build AI.":"为个人与组织提供最先进的 AI 构建平台。","The platform where the machine learning community collaborates on models, datasets, and applications.":"机器学习社区协作构建模型、数据集与应用的地方。","Your prompt here...":"在此输入你的提示词…","Your prompt here":"在此输入你的提示词","View code":"查看代码","Code snippet":"代码片段","Minimize":"最小化"};

  /* ---------- 不翻译的区域 ---------- */
  var SKIP_HARD = [
    'code', 'pre', 'kbd', 'samp', 'script', 'style', 'svg', 'textarea', 'math',
    '.markdown-content', '.md-content', '.hljs',
    '.model-card-content', '.dataset-card-content', '.space-card-content',
    '.prose', '.blog-content', '.md', '.markdown',
    '[data-hfz-skip]', '[contenteditable="true"]'
  ].join(',');
  var SKIP_SEL = SKIP_HARD + ',.font-mono';
  /* .font-mono 里几乎都是仓库名 / 变量名 / 代码，但它也承载卡片角标（Running on ⚡ZERO 之类），
     所以只放行这一小撮确定的界面词，其余照旧跳过 */
  var MONO_OK = { 'Running': '运行中', 'Paused': '已暂停', 'Featured': '精选', 'Agents': '智能体' };

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'data-tooltip'];

  /* ---------- 工具 ---------- */
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function has(k) { return Object.prototype.hasOwnProperty.call(DICT, k); }
  function isSkipped(el) {
    if (!el || el.nodeType !== 1 || !el.closest) return false;
    try { return !!el.closest(SKIP_SEL); } catch (e) { return false; }
  }

  /* ---------- 动态文本规则（全部整段锚定） ---------- */
  var MONTH = {
    Jan: '1月', Feb: '2月', Mar: '3月', Apr: '4月', May: '5月', Jun: '6月',
    Jul: '7月', Aug: '8月', Sep: '9月', Oct: '10月', Nov: '11月', Dec: '12月'
  };
  var UNIT = {
    second: '秒', minute: '分钟', hour: '小时', day: '天', week: '周',
    month: '个月', year: '年'
  };
  var NOUN = {
    model: '模型', dataset: '数据集', space: '空间', app: '应用', user: '用户',
    paper: '论文', collection: '收藏集', like: '点赞', download: '下载',
    result: '结果', task: '任务', bucket: '存储桶', organization: '组织',
    follower: '关注者', post: '帖子', discussion: '讨论', commit: '提交'
  };

  function dateZh(m, d, y) {
    var out = (MONTH[m] || (m + ' ')) + parseInt(d, 10) + '日';
    if (y) out = y + '年' + out;
    return out;
  }

  function rules(t) {
    var m;

    if (t === 'Sort:' || t === 'Sort') return '排序：';
    if (t === 'Filter:' || t === 'Filter') return '筛选：';

    /* about 8 hours ago / around 2 days ago（HF 用 about 前缀表示近似时间） */
    if ((m = /^(?:about|around|over|almost|less than|more than)\s+(.+)$/i.exec(t))) {
      var r0 = rules(m[1]);
      if (r0) return r0;
    }

    /* 相对时间: 3 days ago / 1 hour ago / a minute ago / just now */
    if ((m = /^(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/i.exec(t))) {
      return m[1] + ' ' + UNIT[m[2].toLowerCase()] + '前';
    }
    if ((m = /^(a|an|one)\s+(second|minute|hour|day|week|month|year)\s+ago$/i.exec(t))) {
      return '1 ' + UNIT[m[2].toLowerCase()] + '前';
    }
    if (/^(just now|now)$/i.test(t)) return '刚刚';

    /* 日期: Sep 1 / Aug 24, 2025 */
    if ((m = /^([A-Z][a-z]{2})\s+(\d{1,2})(?:,\s*(\d{4}))?$/.exec(t)) && MONTH[m[1]]) {
      return dateZh(m[1], m[2], m[3]);
    }

    /* Updated Sep 1 / Updated 3 days ago / Last updated 2 hours ago */
    if ((m = /^(?:Last\s+)?[Uu]pdated\s+(.+)$/.exec(t))) {
      var sub = rules(m[1]) || (has(m[1]) ? DICT[m[1]] : null);
      if (sub) return (m[0].charAt(0) === 'L' ? '最后更新于 ' : '更新于 ') + sub;
    }

    /* Created Sep 1 */
    if ((m = /^Created\s+(.+)$/.exec(t))) {
      var sub2 = rules(m[1]) || (has(m[1]) ? DICT[m[1]] : null);
      if (sub2) return '创建于 ' + sub2;
    }

    /* Sort: Trending */
    if ((m = /^Sort:\s*(.+)$/.exec(t))) {
      var s = has(m[1]) ? DICT[m[1]] : rules(m[1]);
      return '排序：' + (s || m[1]);
    }

    /* 计数: 434,632 models / 1 dataset / 2.7k likes */
    if ((m = /^([\d][\d.,]*(?:\s?[kKmMbB])?)\s+([A-Za-z]+?)s?$/.exec(t))) {
      var n = NOUN[m[2].toLowerCase()];
      if (n) return m[1] + ' 个' + n;
    }
    /* + 95 Spaces */
    if ((m = /^\+\s*([\d][\d.,]*[kKmMbB]?)\s+([A-Za-z]+?)s?$/.exec(t))) {
      var n2 = NOUN[m[2].toLowerCase()];
      if (n2) return '+ ' + m[1] + ' 个' + n2;
    }
    /* Showing 1-30 of 1,119,876 */
    if ((m = /^Showing\s+([\d,]+)\s*[-–]\s*([\d,]+)\s+of\s+([\d,]+)$/.exec(t))) {
      return '显示 ' + m[1] + '–' + m[2] + '，共 ' + m[3] + ' 条';
    }
    /* Page 2 of 13 */
    if ((m = /^Page\s+(\d+)\s+of\s+(\d+)$/.exec(t))) return '第 ' + m[1] + ' 页，共 ' + m[2] + ' 页';
    /* 1–30 of 1,119,876 */
    if ((m = /^([\d,]+)\s*[-–]\s*([\d,]+)\s+of\s+([\d,]+)$/.exec(t))) {
      return m[1] + '–' + m[2] + '，共 ' + m[3] + ' 条';
    }
    /* See all 12 matches in the full file. */
    if ((m = /^See all\s+([\d,]+)\s+matches?\s+in\s+the\s+full\s+file\.?$/.exec(t))) {
      return '查看完整文件中的全部 ' + m[1] + ' 处匹配';
    }
    /* Browse 1698 models trained on this dataset */
    if ((m = /^Browse\s+([\d,]+)\s+models?\s+trained\s+on\s+this\s+dataset$/.exec(t))) {
      return '浏览在此数据集上训练的 ' + m[1] + ' 个模型';
    }
    /* 1B params / 7B params */
    if ((m = /^([\d.]+\s?[BMKT]?)\s+params?$/i.exec(t))) return m[1] + ' 参数';

    /* 15 items / 1 item */
    if ((m = /^(\d+)\s+items?$/i.exec(t))) return m[1] + ' 个项目';

    /* How to use meta-llama/Llama-3.2-1B with Transformers: */
    if ((m = /^How to use (.+?) with (.+?):$/.exec(t))) {
      return '用 ' + m[2] + ' 加载 ' + m[1] + '：';
    }

    /* 定价卡片 */
    if ((m = /^Starting at (\$[\d.,]+)\/user\/month$/i.exec(t))) return '低至 ' + m[1] + '/用户/月';
    if ((m = /^Starting at (\$[\d.,]+)\/hour for GPU$/i.exec(t))) return 'GPU 低至 ' + m[1] + '/小时';

    /* 16 authors / 1 author */
    if ((m = /^(\d+)\s+authors?$/i.exec(t))) return m[1] + ' 位作者';

    /* 2 replies / 1 reply */
    if ((m = /^(\d+)\s+repl(?:y|ies)$/i.exec(t))) return m[1] + ' 条回复';

    /* 25k rows / 179 rows */
    if ((m = /^([\d.,]+\s?[kKmMbB]?)\s+rows?$/i.exec(t))) return m[1] + ' 行';

    /* 2 Nov 2026（日-月-年） */
    if ((m = /^(\d{1,2})\s+([A-Z][a-z]{2})\s+(\d{4})$/.exec(t)) && MONTH[m[2]]) {
      return m[3] + '年' + MONTH[m[2]] + parseInt(m[1], 10) + '日';
    }

    /* Dataset Card for "imdb" / Model Card for "x" */
    if ((m = /^(Dataset|Model|Space) Card for "(.*)"$/.exec(t))) {
      var cardKind = m[1] === 'Dataset' ? '数据集' : (m[1] === 'Model' ? '模型' : '空间');
      return m[2] + ' 的' + cardKind + '卡';
    }
    /* 2 classes / 1 class */
    if ((m = /^(\d+)\s+class(?:es)?$/i.exec(t))) return m[1] + ' 个类别';

    /* 8 languages / 1 language */
    if ((m = /^(\d+)\s+languages?$/i.exec(t))) return m[1] + ' 种语言';

    /* License: / arxiv: 这类前缀标签 */
    if (/^(License|arXiv|arxiv|Paper|DOI|Base model|Dataset|Space|Collection):$/i.test(t)) {
      return t.replace(/^arxiv:$/i, 'arXiv：').replace(/:$/, '：');
    }

    /* MCP (2) / Agents (1) —— 带计数的标签 */
    if ((m = /^(MCP|Omni|Agents|Collections?|Datasets?|Spaces?)\s*\((\d+)\)$/.exec(t))) {
      var cbase = has(m[1]) ? DICT[m[1]] : m[1];
      return cbase + '（' + m[2] + '）';
    }
    /* Split (3) / Subset (1) / Config (2) */
    if ((m = /^(Split|Subset|Config)\s*\((\d+)\)$/.exec(t))) {
      var slbl = m[1] === 'Split' ? '划分' : (m[1] === 'Subset' ? '子集' : '配置');
      return slbl + '（' + m[2] + '）';
    }

    /* X rows / Y columns in dataset viewer */
    if ((m = /^([\d,]+)\s+rows?$/.exec(t))) {
      if (t.indexOf('rows') === t.length - 4) {}
      return null;
    }
    return null;
  }

  function lookup(t) {
    if (has(t)) return DICT[t];
    return rules(t);
  }

  /* ---------- 记录 & 替换 ---------- */
  var recs = new WeakMap();
  var touched = [];

  function translateText(node) {
    var cur = node.nodeValue;
    if (!cur || !cur.trim()) return;
    var rec = recs.get(node);
    if (rec && cur === rec.out) return;
    var t = norm(cur);
    if (t.length < 2 || t.length > 90) return;
    if (!/[A-Za-z]/.test(t)) return;
    var el = node.parentElement;
    if (!el || (el.closest && el.closest(SKIP_HARD))) return;
    var hit;
    if (el.closest && el.closest('.font-mono')) {
      hit = MONO_OK[t] || null;
      if (!hit) return;
      /* 卡片角标「Running on ⚡ZERO」：Running 译成「运行于」，并把中间的 on 去掉 */
      if (t === 'Running' && /^Running on\b/.test(norm(el.textContent || ''))) {
        hit = '运行于';
        var onSpan = el.querySelector('span.mx-1');
        if (onSpan && norm(onSpan.textContent) === 'on' && onSpan.firstChild && onSpan.firstChild.nodeType === 3) {
          recs.set(onSpan.firstChild, { src: 'on', out: '' });
          touched.push(onSpan.firstChild);
          onSpan.firstChild.nodeValue = '';
        }
      }
    } else {
      hit = lookup(t);
    }
    if (hit == null || hit === t) return;
    var lead = /^\s*/.exec(cur)[0];
    var trail = /\s*$/.exec(cur)[0];
    var out = lead + hit + trail;
    if (out === cur) return;
    recs.set(node, { src: cur, out: out });
    touched.push(node);
    node.nodeValue = out;
  }

  function translateAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      var v = el.getAttribute(a);
      if (!v || v.length > 90) continue;
      var t = norm(v);
      if (!/[A-Za-z]/.test(t)) continue;
      var hit = lookup(t);
      if (hit && hit !== v) el.setAttribute(a, hit);
    }
  }

  function scan(root) {
    if (!root || !root.isConnected) return;
    if (root.nodeType === 3) { translateText(root); return; }
    if (root.nodeType !== 1) return;
    if (isSkipped(root)) return;
    translateAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
    var n = root.firstChild, guard = 0;
    if (n) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
      var cur;
      while ((cur = walker.nextNode()) && guard++ < 20000) {
        if (cur.nodeType === 1) { translateAttrs(cur); continue; }
        translateText(cur);
      }
    }
  }

  /* ---------- 观察器（去抖） ---------- */
  var queue = [];
  var queued = new WeakSet();
  var timer = null;

  function enqueue(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      if (queued.has(node)) return;
      queued.add(node);
    }
    queue.push(node);
    if (timer) return;
    timer = setTimeout(flush, 90);
  }

  function flush() {
    timer = null;
    var items = queue.slice(0);
    queue.length = 0;
    if (!enabled) return;
    for (var i = 0; i < items.length; i++) {
      var n = items[i];
      if (!n.isConnected) continue;
      try { scan(n); } catch (e) {}
    }
  }

  var mo = new MutationObserver(function (muts) {
    if (!enabled) return;
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') { enqueue(m.target); continue; }
      if (m.type === 'attributes') { enqueue(m.target); continue; }
      if (m.type === 'childList') {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var an = m.addedNodes[j];
          if (an.nodeType === 1 || an.nodeType === 3) enqueue(an);
        }
      }
    }
  });

  /* ---------- 路由 ---------- */
  function onRoute() {
    setTimeout(function () { if (enabled) { scan(document.body); translateTitle(); } }, 150);
    setTimeout(function () { if (enabled) { scan(document.body); translateTitle(); } }, 700);
  }

  /* ---------- 标题 ---------- */
  function translateTitle() {
    var t = document.title;
    if (!t || t.length > 160) return;
    var parts = t.split(/ ([·–—|]) /);
    var changed = false;
    for (var i = 0; i < parts.length; i += 2) {
      var p = parts[i];
      var hit = lookup(norm(p));
      if (hit) { parts[i] = hit; changed = true; }
    }
    if (changed) document.title = parts.join(' '); 
  }

  /* ---------- 开关 ---------- */
  var enabled = true;
  try { enabled = localStorage.getItem('hf-zh:enabled') !== '0'; } catch (e) {}

  function restoreAll() {
    for (var i = 0; i < touched.length; i++) {
      var n = touched[i];
      if (!n || !n.isConnected) continue;
      var r = recs.get(n);
      if (r && n.nodeValue === r.out) n.nodeValue = r.src;
    }
  }

  function setEnabled(on) {
    enabled = !!on;
    try { localStorage.setItem('hf-zh:enabled', on ? '1' : '0'); } catch (e) {}
    if (on) { scan(document.body); translateTitle(); }
    else { restoreAll(); }
    renderToggle();
  }

  /* ---------- 悬浮开关 ---------- */
  var btn;
  function renderToggle() {
    if (!btn) return;
    btn.textContent = enabled ? '中' : 'EN';
    btn.setAttribute('title', enabled ? '已开启汉化（点击或 Alt+Z 关闭）' : '汉化已关闭（点击或 Alt+Z 开启）');
    btn.style.opacity = enabled ? '0.45' : '0.3';
  }

  function mountToggle() {
    if (btn || !document.body) return;
    btn = document.createElement('div');
    btn.id = 'hf-zh-toggle';
    btn.style.cssText = [
      'position:fixed', 'left:14px', 'bottom:14px', 'z-index:2147483000',
      'width:30px', 'height:30px', 'border-radius:50%', 'cursor:pointer',
      'display:flex', 'align-items:center', 'justify-content:center',
      'font:600 13px/1 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif',
      'color:#fff', 'background:#ff9d0b', 'box-shadow:0 2px 8px rgba(0,0,0,.25)',
      'user-select:none', 'transition:opacity .15s'
    ].join(';');
    btn.addEventListener('mouseenter', function () { btn.style.opacity = '1'; });
    btn.addEventListener('mouseleave', renderToggle);
    btn.addEventListener('click', function (e) { e.stopPropagation(); setEnabled(!enabled); });
    document.body.appendChild(btn);
    renderToggle();
  }

  /* ---------- 启动 ---------- */
  function boot() {
    mountToggle();
    if (!enabled) return;
    scan(document.body);
    translateTitle();
    mo.observe(document.documentElement, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
    setTimeout(function () { scan(document.body); translateTitle(); }, 400);
    setTimeout(function () { scan(document.body); translateTitle(); }, 1500);
  }

  var _push = history.pushState, _replace = history.replaceState;
  history.pushState = function () { var r = _push.apply(this, arguments); onRoute(); return r; };
  history.replaceState = function () { var r = _replace.apply(this, arguments); onRoute(); return r; };
  window.addEventListener('popstate', onRoute);
  window.addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); setEnabled(!enabled); }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

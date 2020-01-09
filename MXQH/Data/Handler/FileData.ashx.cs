using MXQH.Data.Handler;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web;

namespace MXQH.Data.Handers
{
    /// <summary>
    /// FileData 的摘要说明
    /// </summary>
    public class FileData : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                string method = context.Request.Form["method"] ?? "";
                string data = context.Request.Form["data"] ?? "";
                string strJson = "";
                switch (method)
                {
                    case "GetFileList": strJson = GetFileList(data);break;
                    case "AddDialog": strJson = AddDialog(data); break;
                    case "GetFileText": strJson = GetFileText(data); break;
                    case "GetSelectText": strJson = GetSelectText(data); break;
                    case "WriteFile": strJson = WriteFileText(data); break;
                    case "AddUISelect": strJson = WriteFileText(data, "UISelect"); break;
                }

                context.Response.ContentType = "text/Json";
                context.Response.Write(strJson);
            }
            catch (Exception ex)
            {
                Exception e = ex;
                while (e.InnerException != null)
                {
                    e = e.InnerException;
                }
                throw new Exception(e.Message + "。");
            }
            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        //获取文件列表
        private string GetFileList(string type) {
            string str = AppDomain.CurrentDomain.BaseDirectory;
            List<string> list = new List<string>();
            getFiles(str, getType(type), list, str);

            return JsonConvert.SerializeObject(list);
        }


        //保存dialog数据
        private string AddDialog(string data) {
            string str = AppDomain.CurrentDomain.BaseDirectory + "Data\\";
            WriteFile(str, "Dialog.json", data);
            return "";
        }

        //读取文件内容
        private string GetFileText(string FileName)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            try
            {
                string strPath = AppDomain.CurrentDomain.BaseDirectory + "CustomFun\\";
                string strHtmlPath = strPath + FileName + ".html";
                string strJsPath = strPath + FileName + ".js";
                strHtmlPath = !File.Exists(strHtmlPath) ? AppDomain.CurrentDomain.BaseDirectory + "Data\\Handler\\New.html" : strHtmlPath;
                strJsPath = !File.Exists(strJsPath) ? AppDomain.CurrentDomain.BaseDirectory + "Data\\Handler\\New.js" : strJsPath;
                using (StreamReader sr = new StreamReader(strHtmlPath, Encoding.UTF8))
                {
                    string str1 = sr.ReadToEnd(); // 读取文件
                    dic.Add("Html", str1);
                }
                using (StreamReader sr2 = new StreamReader(strJsPath, Encoding.UTF8))
                {
                    string str2 = sr2.ReadToEnd(); // 读取文件
                    dic.Add("Js", str2);
                }
                return JsonConvert.SerializeObject(dic); ;
            }
            catch (Exception ex)
            {
                dic.Add("Error", ex.Message);
                return JsonConvert.SerializeObject(dic); ;
            }
        }

        //获取Select 的值
        private string GetSelectText(string FileName)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            try
            {
                string strPath = AppDomain.CurrentDomain.BaseDirectory + "CustomFun\\UISelect\\";
                string strHtmlPath = strPath + FileName + ".html";
                if (!File.Exists(strHtmlPath)) { return "{}"; }
                using (StreamReader sr = new StreamReader(strHtmlPath, Encoding.UTF8))
                {
                    string str1 = sr.ReadToEnd(); // 读取文件
                    dic.Add("Html", str1);
                }
                return JsonConvert.SerializeObject(dic); ;
            }
            catch (Exception ex)
            {
                dic.Add("Error", ex.Message);
                return JsonConvert.SerializeObject(dic); ;
            }
        }

        //写取文件内容
        private string WriteFileText(string data, string Dir = "")
        {
            try
            {
                //Dir = Dir == "" ? DateTime.Now.ToString("yyyyMM") : Dir;
                FileSave f = JsonConvert.DeserializeObject<FileSave>(data);
                string dirPath = AppDomain.CurrentDomain.BaseDirectory + "CustomFun\\" + (Dir == "" ? "" : Dir + "\\");
                dirPath = dirPath + (string.IsNullOrEmpty(f.Dir) ? "" : f.Dir + "\\");
                
                //验证文件路径
                if (!Directory.Exists(dirPath))
                {
                    Directory.CreateDirectory(dirPath);
                }

                string strFilePath = dirPath + f.FileName;
                using (StreamWriter sw = new StreamWriter(strFilePath, false, Encoding.UTF8))
                {
                    byte[] bytes = Convert.FromBase64String(f.Text);
                    sw.Write(HttpContext.Current.Server.UrlDecode(Encoding.UTF8.GetString(bytes)));
                    sw.Flush();
                }
                return "{}";
            }
            catch (Exception ex)
            {
                return "{Error: \"" + ex.Message + "\"}";
            }
        }

        private string getType(string type) {
            string str = "";
            switch (type)
            {
                case "1":str = "*.html"; break;
                case "2": str = "*.js,*.css"; break;
                //case "3": str = "*.css"; break;
            }
            return str;
        }

        private void getFiles(string path, string strType, List<string> list, string BasicPath)
        {
            DirectoryInfo root = new DirectoryInfo(path);
            string[] arr = strType.Split(',');
            foreach(var type  in arr)
            {
                foreach (System.IO.FileInfo f in root.GetFiles(type))
                {
                    FileList en = new FileList();
                    //en.name = f.Name;
                    string str = f.FullName.Substring(BasicPath.Length, f.FullName.Length - BasicPath.Length);
                    list.Add(str);
                }
            }
            foreach(DirectoryInfo d in root.GetDirectories())
            {
                getFiles(d.FullName, strType, list, BasicPath);
            }
        }

        /// <summary>
        /// 将html代码字符串写到HTML文件文件
        /// </summary>
        /// <param name="strFilePath">要写入的目录</param>
        /// <param name="strFileName">文件名称</param>
        /// <param name="strText">HTML代码字符串</param>
        /// <param name="strEncode">编码方式</param>
        public static void WriteFile(string strFilePath, string strFileName, string strText, string strEncode = "gb2312")
        {
            StreamWriter sw = null;
            // 写文件
            try
            {
                //验证文件路径
                if (!Directory.Exists(strFilePath))
                {
                    Directory.CreateDirectory(strFilePath);
                }

                Encoding code = Encoding.GetEncoding(strEncode);
                sw = new StreamWriter(strFilePath + strFileName, false, code);
                sw.Write(strText);
                sw.Flush();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                sw.Close();
                sw.Dispose();
            }
        }
    }
}
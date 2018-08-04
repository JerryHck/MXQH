using MXQH.Data.Handler;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using Newtonsoft;
using Newtonsoft.Json;
using System.Text;

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
                //传入值 type 1- 取HTML文件，2-js 文件，css文件
                string method = context.Request.Form["method"] ?? "";
                string data = context.Request.Form["data"] ?? "";
                string strJson = "";
                switch (method)
                {
                    case "GetFileList": strJson = GetFileList(data);break;
                    case "AddDialog": strJson = AddDialog(data); break;
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

        private string GetFileList(string type) {
            string str = AppDomain.CurrentDomain.BaseDirectory;
            List<string> list = new List<string>();
            getFiles(str, getType(type), list, str);

            return JsonConvert.SerializeObject(list);
        }

        private string AddDialog(string data) {
            string str = AppDomain.CurrentDomain.BaseDirectory + "Data\\";
            WriteFile(str, "Dialog.json", data);
            return "";
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
                foreach (FileInfo f in root.GetFiles(type))
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
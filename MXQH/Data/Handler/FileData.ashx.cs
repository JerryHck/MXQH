using MXQH.Data.Handler;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using Newtonsoft;
using Newtonsoft.Json;

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
                string type = context.Request.Form["type"] ?? "";

                string str = AppDomain.CurrentDomain.BaseDirectory;
                List<string> list = new List<string>();
                getFiles(str, getType(type), list, str);

                string json = JsonConvert.SerializeObject(list);

                context.Response.ContentType = "text/Json";
                context.Response.Write(json);
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
    }
}
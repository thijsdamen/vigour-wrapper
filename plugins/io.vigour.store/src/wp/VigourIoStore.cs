using System;
using System.Runtime.Serialization;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class VigourIoStore : BaseCommand
    {

        public enum ErrorCode : int
        {
            UnknownError = 0,
            FormattingError = 1,
            ParsingError = 2,
            PatternError = 3
        }

        [DataContract]
        public class VigourIoStoreError
        {
            public const string UnknownError = "UNKNOWN_ERROR";
            public const string FormattingError = "FORMATTIN_ERROR";
            public const string ParsingError = "PARSING_ERROR";
            public const string PatternError = "PATTERN_ERROR";

            [DataMember(Name = "code", IsRequired = false)]
            public ErrorCode Code { get; set; }

            [DataMember(Name = "message", IsRequired = false)]
            public string Message { get; set; }

            public VigourIoStoreError()
            {
                this.Code = ErrorCode.UnknownError;
                this.Message = UnknownError;
            }
        }

        public void setup(string options)
        {
            try
            {
                PluginResult result = new PluginResult(PluginResult.Status.OK);
                this.DispatchCommandResult(result);
            }
            catch (Exception)
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoStoreError()));
            }
        }

        public void getType(string options)
        {
            try
            {
                //var locale = CultureInfo.CurrentCulture.Name;

                int storeType = 4;

                PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(storeType, "storeType"));
                this.DispatchCommandResult(result);
            }
            catch (Exception)
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoStoreError()));
            }
        }

        public void fetch(string options)
        {
            try
            {
                //var locale = CultureInfo.CurrentCulture.Name;

                string locale = "fetch result";

                PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(locale));
                this.DispatchCommandResult(result);
            }
            catch (Exception)
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoStoreError()));
            }
        }

        public void buy(string options)
        {
            try
            {
                //var locale = CultureInfo.CurrentCulture.Name;

                string locale = "buy result";

                PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(locale));
                this.DispatchCommandResult(result);
            }
            catch (Exception)
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoStoreError()));
            }
        }

        public void restore(string options)
        {
            try
            {
                //var locale = CultureInfo.CurrentCulture.Name;

                string locale = "restore result";

                PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(locale));
                this.DispatchCommandResult(result);
            }
            catch (Exception)
            {
                this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoStoreError()));
            }
        }

        private string WrapIntoJSON<T>(T data, string keyName = "value")
        {
            string param = "{0}";
            string stringifiedData = data.ToString();

            if (data.GetType() == typeof(string))
            {
                param = "\"" + param + "\"";
            }

            if (data.GetType() == typeof(bool))
            {
                stringifiedData = stringifiedData.ToLower();
            }

            if (data.GetType() == typeof(string[]))
            {
                stringifiedData = JSON.JsonHelper.Serialize(data);
            }

            var formattedData = string.Format("\"" + keyName + "\":" + param, stringifiedData);
            formattedData = "{" + formattedData + "}";

            return formattedData;
        }

    }
}

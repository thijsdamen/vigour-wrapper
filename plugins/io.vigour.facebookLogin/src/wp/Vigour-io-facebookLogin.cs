using System;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace WPCordovaClassLib.Cordova.Commands
{
	public class VigourIoFacebookLogin : BaseCommand
	{

		public enum ErrorCode : int
		{
			UnknownError = 0,
			FormattingError = 1,
			ParsingError = 2,
			PatternError = 3
		}

		[DataContract]
		public class VigourIoFacebookLoginError
		{
			public const string UnknownError = "UNKNOWN_ERROR";
			public const string FormattingError = "FORMATTIN_ERROR";
			public const string ParsingError = "PARSING_ERROR";
			public const string PatternError = "PATTERN_ERROR";

			[DataMember(Name = "code", IsRequired = false)]
			public ErrorCode Code { get; set; }

			[DataMember(Name = "message", IsRequired = false)]
			public string Message { get; set; }

			public VigourIoFacebookLoginError()
			{
				this.Code = ErrorCode.UnknownError;
				this.Message = UnknownError;
			}
		}

		public async Task init(string scope)
		{
		    try
		    {
		        PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(scope));
		        this.DispatchCommandResult(result);
		    }
		    catch (Exception)
		    {
		        this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoFacebookLoginError()));
		    }
		}

		public async Task login(string scope)
		{
			try
			{
				PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(scope));
				this.DispatchCommandResult(result);
			}
			catch (Exception)
			{
				this.DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR, new VigourIoFacebookLoginError()));
			}
		}

		private string WrapIntJSONPartial<T>(T data, string keyName = "value")
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
			return string.Format("\"" + keyName + "\":" + param, stringifiedData);
		}

		private string WrapIntoJSON<T>(T data, string keyName = "value")
		{
			var formattedData = WrapIntJSONPartial<T>(data, keyName);
			formattedData = "{" + formattedData + "}";

			return formattedData;
		}

	}
}

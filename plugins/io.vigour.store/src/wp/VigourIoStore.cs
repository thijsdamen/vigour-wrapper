using System;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
#if DEBUG
using MockIAPLib;
using Store = MockIAPLib;
using System.Windows.Threading;
using Windows.ApplicationModel.Store;
using System.Windows;
#else
using Windows.ApplicationModel.Store;
using System.Windows;
#endif

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

		public async Task fetch(string options)
		{
			try
			{
				ListingInformation li = await CurrentApp.LoadListingInformationAsync();

				//var locale = CultureInfo.CurrentCulture.Name;
				string[] opts = JSON.JsonHelper.Deserialize<string[]>(options);
				List<ProductListing> products = new List<ProductListing>(opts.Length);
				for (var i = 0; i < opts.Length; i += 1)
				{
					if (li.ProductListings.ContainsKey(opts[i]))
					{
						products.Add(li.ProductListings[opts[i]]);
					}
				}

				PluginResult result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(products));
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
				// An array of a single productID
				string[] opts = JSON.JsonHelper.Deserialize<string[]>(options);
				string productID = opts[0];
				Deployment.Current.Dispatcher.BeginInvoke(async delegate
				{
					// Purchase the product
					var purchaseResults = await Windows.ApplicationModel.Store.CurrentApp.RequestProductPurchaseAsync(productID);

					PluginResult result;
					switch (purchaseResults.Status)
					{
						case ProductPurchaseStatus.NotFulfilled:
							CurrentApp.ReportProductFulfillment(productID);
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapIntoJSON("ProductPurchaseStatus.NotFulfilled"));
							break;
						case ProductPurchaseStatus.AlreadyPurchased:
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapIntoJSON(purchaseResults.ReceiptXml));
							break;
						case ProductPurchaseStatus.NotPurchased:
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapIntoJSON("ProductPurchaseStatus.NotPurchased"));
							break;
						case ProductPurchaseStatus.Succeeded:
							CurrentApp.ReportProductFulfillment(productID);
							result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(purchaseResults.ReceiptXml));
							break;
						default:
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapIntoJSON("Unhandled Purchasing Error"));
							break;
					}

					this.DispatchCommandResult(result);
				});
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

		private string WrapIntoJSON(List<ProductListing> data, string keyName = "validProducts")
		{

			string param = "{0}";
			string stringifiedData = "[";
			foreach (ProductListing p in data)
			{
				stringifiedData += "{";
				stringifiedData += "\"id\":\"" + p.ProductId + "\"";
				stringifiedData += ",\"name\":\"" + p.Name + "\"";
				stringifiedData += ",\"type\":\"" + p.ProductType + "\"";
				stringifiedData += ",\"tag\":\"" + p.Tag + "\"";
				stringifiedData += ",\"imageUri\":\"" + p.ImageUri + "\"";
				stringifiedData += ",\"keywords\":\"" + p.Keywords + "\"";
				stringifiedData += ",\"formattedPrice\":\"" + p.FormattedPrice + "\"";
				stringifiedData += ",\"description\":\"" + p.Description + "\"";
				stringifiedData += "},";
			}
			if (stringifiedData.Length > 1)
			{
				stringifiedData = stringifiedData.Substring(0, stringifiedData.Length - 1);
			}
			stringifiedData += "]";
			var formattedData = string.Format("\"" + keyName + "\":" + param, stringifiedData);
			formattedData = "{" + formattedData + "}";

			return formattedData;
		}

	}

}

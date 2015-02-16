using System;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using System.Collections.Generic;
#if DEBUG
using MockIAPLib;
using Store = MockIAPLib;
using System.Windows.Threading;
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
					PluginResult result;
#if DEBUG
					var receipt = await CurrentApp.RequestProductPurchaseAsync(productID, true);
					if (CurrentApp.LicenseInformation.ProductLicenses[productID].IsConsumable)
						CurrentApp.ReportProductFulfillment(productID);

					result = new PluginResult(PluginResult.Status.OK, this.WrapIntoJSON(receipt));

					// How to get expiration date from an in-app product.
					//var expDate = CurrentApp.LicenseInformation.ProductLicenses[productID].ExpirationDate;
#else
					//Purchase the product
					var purchaseResults = await CurrentApp.RequestProductPurchaseAsync(productID);


					switch (purchaseResults.Status)
					{
						case ProductPurchaseStatus.NotFulfilled:
							var fulfillResultNotFulfilled = await CurrentApp.ReportConsumableFulfillmentAsync(productID, purchaseResults.TransactionId);
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapPurchaseIntoJSON(purchaseResults, fulfillResultNotFulfilled));
							break;
						case ProductPurchaseStatus.AlreadyPurchased:
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapPurchaseIntoJSON(purchaseResults, FulfillmentResult.NothingToFulfill));
							break;
						case ProductPurchaseStatus.NotPurchased:
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapPurchaseIntoJSON(purchaseResults, FulfillmentResult.NothingToFulfill));
							break;
						case ProductPurchaseStatus.Succeeded:
							var fulfillResult = await CurrentApp.ReportConsumableFulfillmentAsync(productID, purchaseResults.TransactionId);
							result = new PluginResult(PluginResult.Status.OK, this.WrapPurchaseIntoJSON(purchaseResults, fulfillResult));
							break;
						default:
							result = new PluginResult(PluginResult.Status.ERROR, this.WrapIntoJSON("Unhandled Purchasing Error"));
							break;
					}
#endif
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

		private string WrapPurchaseIntoJSON(Windows.ApplicationModel.Store.PurchaseResults data, Windows.ApplicationModel.Store.FulfillmentResult data2)
		{
			var formattedData = WrapIntoJSONPartial(data);
			if (data2 != null) formattedData = formattedData + "," + WrapIntJSONPartial(data2, "fulfillmentResult");
			formattedData = "{" + formattedData + "}";

			return formattedData;
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

			if (data.GetType() == typeof(Windows.ApplicationModel.Store.FulfillmentResult))
			{
				stringifiedData = JSON.JsonHelper.Serialize(stringifiedData);
			}
			return string.Format("\"" + keyName + "\":" + param, stringifiedData);
		}

		private string WrapIntoJSON<T>(T data, string keyName = "value")
		{
			var formattedData = WrapIntJSONPartial<T>(data, keyName);
			formattedData = "{" + formattedData + "}";

			return formattedData;
		}


		private string WrapIntoJSONPartial(Windows.ApplicationModel.Store.PurchaseResults data, string keyName = "purchaseResults")
		{

			string param = "{0}";
			string stringifiedData = "";
			stringifiedData += "{";
			stringifiedData += "\"offerId\":\"" + data.OfferId + "\"";
			stringifiedData += ",\"receiptXml\":" + JSON.JsonHelper.Serialize(data.ReceiptXml);
			stringifiedData += ",\"status\":\"" + data.Status + "\"";
			stringifiedData += ",\"transactionId\":\"" + data.TransactionId + "\"";
			stringifiedData += "}";

			var formattedData = string.Format("\"" + keyName + "\":" + param, stringifiedData);

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

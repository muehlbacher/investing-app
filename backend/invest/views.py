# financial_data/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import (
    prepare_table_data_selected_metrics,
    prepare_wb_table_data,
)  # Assuming you place the function in utils.py
from .errors import CompanyDoesNotExistError
from django.http import JsonResponse
from django.db.models import Q
from .models.company_model import Company  # Ensure this model exists


class FinancialDataAPIView(APIView):
    def get(self, request, ticker):
        metrics = request.query_params.getlist(
            "metrics"
        )  # Optional query param for custom metrics

        try:
            metric_data, unique_years = prepare_table_data_selected_metrics(
                ticker, metrics
            )
            if not metric_data:
                return Response(
                    {"message": "No data available for the selected metrics."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "metricData": metric_data,
                    "uniqueYears": unique_years,
                }
            )

        except CompanyDoesNotExistError as e:
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WbDataAPIView(APIView):
    def get(self, request, ticker):
        metrics = request.query_params.getlist(
            "metrics"
        )  # Optional query param for custom metrics

        try:
            metric_data, unique_years = prepare_wb_table_data(ticker)
            if not metric_data:
                return Response(
                    {"message": "No data available for the selected metrics."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "wb_data": metric_data,
                    "uniqueYears": unique_years,
                }
            )

        except CompanyDoesNotExistError as e:
            return Response({"message": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(
                {"message": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def search_companies(request):
    query = request.GET.get("q", "").strip()  # Get search query from frontend
    if not query:
        return JsonResponse({"results": []})  # Return empty if no query

    results = Company.objects.filter(
        Q(Ticker__icontains=query) | Q(Name__icontains=query)
    )[:10]

    data = [
        {"id": company.CompanyID, "name": company.Name, "ticker": company.Ticker}
        for company in results
    ]

    return JsonResponse({"results": data})
